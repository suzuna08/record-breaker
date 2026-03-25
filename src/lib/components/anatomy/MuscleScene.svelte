<script lang="ts">
	/**
	 * Inner 3D scene rendered inside Threlte <Canvas>.
	 * Handles: GLB loading, mesh indexing, material states, camera animation, raycasting.
	 */
	import { T, useTask, useThrelte } from '@threlte/core';
	import { OrbitControls, useGltf } from '@threlte/extras';
	import * as THREE from 'three';
	import { getMeshKey, getRegionColor } from '$lib/data/mesh-key-map';

	type CameraPreset = 'front' | 'back' | 'left' | 'right';

	interface Props {
		modelUrl: string;
		highlightedMeshKeys?: string[];
		primaryMeshKeys?: string[];
		secondaryMeshKeys?: string[];
		selectedMeshKey?: string | null;
		onMuscleClick?: (meshKey: string) => void;
		onMuscleHover?: (meshKey: string | null) => void;
		cameraPreset?: CameraPreset;
		allowOrbit?: boolean;
	}

	let {
		modelUrl,
		highlightedMeshKeys = [],
		primaryMeshKeys = [],
		secondaryMeshKeys = [],
		selectedMeshKey = null,
		onMuscleClick,
		onMuscleHover,
		cameraPreset = 'front',
		allowOrbit = true,
	}: Props = $props();

	const { renderer, camera } = useThrelte();
	const gltf = useGltf(modelUrl);

	let meshIndex = $state<Map<string, THREE.Mesh[]>>(new Map());
	let hoveredKey = $state<string | null>(null);
	let sceneGroup = $state<THREE.Group | undefined>(undefined);
	let orbitRef = $state<any>(null);
	let cameraRef = $state<THREE.PerspectiveCamera | undefined>(undefined);

	// Reusable materials — one per mesh_key, mutated in place for zero GC
	const matMap = new Map<string, THREE.MeshPhysicalMaterial>();
	const bodyMat = new THREE.MeshPhysicalMaterial({
		color: 0xc8c5c0,
		roughness: 0.75,
		metalness: 0.02,
		clearcoat: 0.08,
		clearcoatRoughness: 0.85,
	});

	const BODY_BASE = new THREE.Color(0xc8c5c0);
	const MUSCLE_BASE = new THREE.Color(0x998888);
	const ACTIVE_RED = new THREE.Color(0xcc3333);

	// ---- Model indexing ----
	$effect(() => {
		if (!$gltf) return;
		const idx = new Map<string, THREE.Mesh[]>();

		$gltf.scene.traverse((child) => {
			if (!(child instanceof THREE.Mesh)) return;
			const key = getMeshKey(child.name);
			if (!key) {
				child.material = bodyMat;
				return;
			}
			const list = idx.get(key) ?? [];
			list.push(child);
			idx.set(key, list);
		});

		meshIndex = idx;
	});

	// ---- Material updates driven by props + hover state ----
	$effect(() => {
		for (const [key, meshes] of meshIndex) {
			const isP = primaryMeshKeys.includes(key);
			const isS = secondaryMeshKeys.includes(key);
			const isH = highlightedMeshKeys.includes(key);
			const isSel = key === selectedMeshKey;
			const isHov = key === hoveredKey;

			let mat = matMap.get(key);
			if (!mat) {
				mat = new THREE.MeshPhysicalMaterial({
					roughness: 0.55,
					metalness: 0.08,
					clearcoat: 0.1,
					clearcoatRoughness: 0.6,
				});
				matMap.set(key, mat);
			}

			const regionCol = getRegionColor(key);

			if (isSel) {
				mat.color.copy(ACTIVE_RED);
				mat.emissive.copy(ACTIVE_RED).multiplyScalar(0.45);
				mat.emissiveIntensity = 1.2;
				mat.clearcoat = 0.3;
				mat.roughness = 0.4;
				mat.transparent = false;
				mat.opacity = 1;
			} else if (isP) {
				mat.color.copy(ACTIVE_RED).lerp(regionCol, 0.15);
				mat.emissive.copy(ACTIVE_RED).multiplyScalar(0.25);
				mat.emissiveIntensity = isHov ? 1.4 : 0.85;
				mat.clearcoat = isHov ? 0.25 : 0.15;
				mat.roughness = 0.45;
				mat.transparent = false;
				mat.opacity = 1;
			} else if (isS) {
				const col = new THREE.Color().copy(ACTIVE_RED).lerp(MUSCLE_BASE, 0.45);
				mat.color.copy(col);
				mat.emissive.copy(ACTIVE_RED).multiplyScalar(0.1);
				mat.emissiveIntensity = isHov ? 0.7 : 0.35;
				mat.clearcoat = 0.1;
				mat.roughness = 0.55;
				mat.transparent = true;
				mat.opacity = 0.92;
			} else if (isH) {
				mat.color.copy(MUSCLE_BASE).lerp(regionCol, 0.2);
				mat.emissive.copy(regionCol).multiplyScalar(0.06);
				mat.emissiveIntensity = isHov ? 0.5 : 0.15;
				mat.clearcoat = 0.08;
				mat.roughness = 0.6;
				mat.transparent = true;
				mat.opacity = 0.88;
			} else if (isHov) {
				mat.color.copy(MUSCLE_BASE).lerp(regionCol, 0.3);
				mat.emissive.copy(regionCol).multiplyScalar(0.15);
				mat.emissiveIntensity = 0.5;
				mat.clearcoat = 0.15;
				mat.roughness = 0.5;
				mat.transparent = false;
				mat.opacity = 1;
			} else {
				mat.color.copy(MUSCLE_BASE);
				mat.emissive.set(0x000000);
				mat.emissiveIntensity = 0;
				mat.clearcoat = 0.05;
				mat.roughness = 0.65;
				mat.transparent = false;
				mat.opacity = 1;
			}

			mat.needsUpdate = true;
			for (const m of meshes) m.material = mat;
		}
	});

	// ---- Smooth camera animation ----
	const CAMERA_TARGET = new THREE.Vector3(0, 1.05, 0);
	const CAM_DISTANCE = 2.2;
	const PRESETS: Record<CameraPreset, THREE.Vector3> = {
		front: new THREE.Vector3(0, 1.15, CAM_DISTANCE),
		back: new THREE.Vector3(0, 1.15, -CAM_DISTANCE),
		left: new THREE.Vector3(-CAM_DISTANCE, 1.15, 0),
		right: new THREE.Vector3(CAM_DISTANCE, 1.15, 0),
	};

	let camTarget = new THREE.Vector3().copy(PRESETS.front);
	let camCurrent = new THREE.Vector3().copy(PRESETS.front);
	let animating = false;

	$effect(() => {
		const dest = PRESETS[cameraPreset];
		if (!dest) return;
		camTarget.copy(dest);
		animating = true;
	});

	useTask((delta) => {
		if (!cameraRef || !orbitRef) return;

		if (animating) {
			camCurrent.lerp(camTarget, 1 - Math.pow(0.001, delta));
			const dist = camCurrent.distanceTo(camTarget);
			if (dist < 0.005) {
				camCurrent.copy(camTarget);
				animating = false;
			}
			cameraRef.position.copy(camCurrent);
			orbitRef.target.copy(CAMERA_TARGET);
			orbitRef.update();
		} else {
			camCurrent.copy(cameraRef.position);
		}
	});

	// ---- Raycasting (manual, per-frame on pointer move) ----
	const raycaster = new THREE.Raycaster();
	const pointer = new THREE.Vector2(-999, -999);
	let pointerDown = false;
	let pointerMoved = false;

	function toNDC(e: PointerEvent) {
		const el = renderer.domElement;
		const rect = el.getBoundingClientRect();
		pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
		pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
	}

	function findHit(): string | null {
		if (!sceneGroup || !cameraRef) return null;
		raycaster.setFromCamera(pointer, cameraRef);
		const hits = raycaster.intersectObjects(sceneGroup.children, true);
		for (const h of hits) {
			if (!(h.object instanceof THREE.Mesh)) continue;
			const k = getMeshKey(h.object.name);
			if (k) return k;
		}
		return null;
	}

	function onPointerMove(e: PointerEvent) {
		toNDC(e);
		pointerMoved = true;
		const key = findHit();
		if (key !== hoveredKey) {
			hoveredKey = key;
			onMuscleHover?.(key);
		}
		renderer.domElement.style.cursor = key ? 'pointer' : 'grab';
	}

	function onPointerDown(e: PointerEvent) {
		toNDC(e);
		pointerDown = true;
		pointerMoved = false;
	}

	function onPointerUp(_e: PointerEvent) {
		if (pointerDown && !pointerMoved) {
			// Didn't drag — treat as click
		}
		pointerDown = false;
	}

	function onClick(e: MouseEvent) {
		const el = renderer.domElement;
		const rect = el.getBoundingClientRect();
		pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
		pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
		const key = findHit();
		if (key) onMuscleClick?.(key);
	}

	function onPointerLeave() {
		if (hoveredKey) {
			hoveredKey = null;
			onMuscleHover?.(null);
		}
		renderer.domElement.style.cursor = 'grab';
	}

	$effect(() => {
		const el = renderer.domElement;
		el.addEventListener('pointermove', onPointerMove);
		el.addEventListener('pointerdown', onPointerDown);
		el.addEventListener('pointerup', onPointerUp);
		el.addEventListener('click', onClick);
		el.addEventListener('pointerleave', onPointerLeave);
		el.style.cursor = 'grab';

		return () => {
			el.removeEventListener('pointermove', onPointerMove);
			el.removeEventListener('pointerdown', onPointerDown);
			el.removeEventListener('pointerup', onPointerUp);
			el.removeEventListener('click', onClick);
			el.removeEventListener('pointerleave', onPointerLeave);
		};
	});
</script>

<!-- Camera -->
<T.PerspectiveCamera
	makeDefault
	bind:ref={cameraRef}
	position={[0, 1.15, 2.2]}
	fov={36}
	near={0.1}
	far={20}
>
	{#if allowOrbit}
		<OrbitControls
			bind:ref={orbitRef}
			enableDamping
			dampingFactor={0.08}
			minDistance={1.0}
			maxDistance={4.5}
			minPolarAngle={Math.PI * 0.1}
			maxPolarAngle={Math.PI * 0.9}
			target={[0, 1.05, 0]}
			enablePan={false}
			rotateSpeed={0.6}
			zoomSpeed={0.8}
		/>
	{/if}
</T.PerspectiveCamera>

<!-- Lighting: tuned for light background, sculpted anatomy -->
<T.AmbientLight intensity={0.4} color={0xf0f0f0} />

<!-- Key light: warm, from upper-right-front -->
<T.DirectionalLight
	position={[2.5, 4, 3]}
	intensity={1.2}
	color={0xfffaf0}
/>

<!-- Fill light: cool, from left -->
<T.DirectionalLight
	position={[-3, 2, 1]}
	intensity={0.5}
	color={0xdde4f0}
/>

<!-- Back rim light for edge definition -->
<T.DirectionalLight
	position={[0.5, 3, -3]}
	intensity={0.6}
	color={0xc8d0e0}
/>

<!-- Under-fill: warm bounce -->
<T.PointLight position={[0, 0.2, 1]} intensity={0.2} color={0xf0e8d8} distance={4} />

<!-- Sky/ground hemisphere -->
<T.HemisphereLight args={[0xe8e8f0, 0xc0c0c8, 0.3]} />

<!-- Model -->
{#if $gltf}
	<T.Group bind:ref={sceneGroup}>
		<T is={$gltf.scene} />
	</T.Group>
{/if}
