<script lang="ts">
	/**
	 * Inner 3D scene for the stylized game-like muscle character viewer.
	 *
	 * Rendered inside a Threlte <Canvas>. Handles:
	 *   - GLB loading + mesh_key indexing
	 *   - Toon-inspired material system with warm skin tones
	 *   - Animated glow / pulse highlights for active muscles
	 *   - Subtle idle breathing animation
	 *   - Display podium with energy ring
	 *   - Smooth camera preset animation
	 *   - Raycasting for hover/click
	 *   - Premium game-like lighting rig
	 */
	import { T, useTask, useThrelte } from '@threlte/core';
	import { OrbitControls, useGltf } from '@threlte/extras';
	import * as THREE from 'three';
	import { getMeshKey } from '$lib/data/mesh-key-map';
	import { getRegionStyle, type MuscleRegionStyle } from '$lib/data/muscle-regions';

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

	// Podium energy ring
	let podiumRingRef = $state<THREE.Mesh | undefined>(undefined);

	// ── Reusable materials ──

	const matMap = new Map<string, THREE.MeshPhysicalMaterial>();

	const bodyMat = new THREE.MeshPhysicalMaterial({
		color: 0xf5d0b5,
		roughness: 0.72,
		metalness: 0.0,
		clearcoat: 0.12,
		clearcoatRoughness: 0.7,
		sheen: 0.3,
		sheenColor: new THREE.Color(0xffe0cc),
	});

	const podiumMat = new THREE.MeshPhysicalMaterial({
		color: 0x1a1a2e,
		roughness: 0.25,
		metalness: 0.5,
		clearcoat: 0.8,
		clearcoatRoughness: 0.1,
	});

	const SKIN_BASE = new THREE.Color(0xf0c8a8);
	const SKIN_MUSCLE = new THREE.Color(0xe8b898);

	// ── Model indexing ──

	$effect(() => {
		if (!$gltf) return;
		const idx = new Map<string, THREE.Mesh[]>();

		$gltf.scene.traverse((child) => {
			if (!(child instanceof THREE.Mesh)) return;
			const name = child.name;

			if (name === '__podium') {
				child.material = podiumMat;
				return;
			}
			if (name.startsWith('__')) {
				child.material = bodyMat;
				return;
			}

			const key = getMeshKey(name);
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

	// ── Animated material state ──

	let elapsedTime = 0;

	function updateMaterials(delta: number) {
		elapsedTime += delta;

		for (const [key, meshes] of meshIndex) {
			const isP = primaryMeshKeys.includes(key);
			const isS = secondaryMeshKeys.includes(key);
			const isH = highlightedMeshKeys.includes(key);
			const isSel = key === selectedMeshKey;
			const isHov = key === hoveredKey;

			const style = getRegionStyle(key);
			const glowCol = new THREE.Color(style.glowColor);
			const accentCol = new THREE.Color(style.accentColor);

			let mat = matMap.get(key);
			if (!mat) {
				mat = new THREE.MeshPhysicalMaterial({
					roughness: 0.5,
					metalness: 0.02,
					clearcoat: 0.15,
					clearcoatRoughness: 0.5,
					sheen: 0.2,
					sheenColor: new THREE.Color(0xffe8d8),
				});
				matMap.set(key, mat);
			}

			const pulse = Math.sin(elapsedTime * style.pulseSpeed * 3.0) * 0.5 + 0.5;

			if (isSel) {
				mat.color.copy(glowCol).lerp(accentCol, pulse * 0.3);
				mat.emissive.copy(glowCol);
				mat.emissiveIntensity = 0.6 + pulse * 0.4;
				mat.clearcoat = 0.4;
				mat.roughness = 0.3;
				mat.transparent = false;
				mat.opacity = 1;
				mat.sheen = 0.5;
				mat.sheenColor.copy(accentCol);
			} else if (isP) {
				mat.color.copy(glowCol).lerp(SKIN_MUSCLE, 0.2);
				mat.emissive.copy(glowCol);
				mat.emissiveIntensity = (isHov ? 0.55 : 0.35) + pulse * 0.15;
				mat.clearcoat = isHov ? 0.35 : 0.2;
				mat.roughness = 0.4;
				mat.transparent = false;
				mat.opacity = 1;
				mat.sheen = 0.3;
				mat.sheenColor.copy(accentCol);
			} else if (isS) {
				const col = new THREE.Color().copy(glowCol).lerp(SKIN_MUSCLE, 0.5);
				mat.color.copy(col);
				mat.emissive.copy(glowCol);
				mat.emissiveIntensity = (isHov ? 0.3 : 0.15) + pulse * 0.08;
				mat.clearcoat = 0.12;
				mat.roughness = 0.5;
				mat.transparent = true;
				mat.opacity = 0.94;
				mat.sheen = 0.2;
				mat.sheenColor.copy(accentCol);
			} else if (isH) {
				mat.color.copy(SKIN_MUSCLE).lerp(glowCol, 0.15);
				mat.emissive.copy(glowCol);
				mat.emissiveIntensity = isHov ? 0.2 : 0.05;
				mat.clearcoat = 0.1;
				mat.roughness = 0.55;
				mat.transparent = true;
				mat.opacity = 0.9;
				mat.sheen = 0.15;
				mat.sheenColor.copy(accentCol);
			} else if (isHov) {
				mat.color.copy(SKIN_MUSCLE).lerp(glowCol, 0.25);
				mat.emissive.copy(glowCol);
				mat.emissiveIntensity = 0.15 + pulse * 0.1;
				mat.clearcoat = 0.2;
				mat.roughness = 0.45;
				mat.transparent = false;
				mat.opacity = 1;
				mat.sheen = 0.25;
				mat.sheenColor.copy(accentCol);
			} else {
				mat.color.copy(SKIN_MUSCLE);
				mat.emissive.set(0x000000);
				mat.emissiveIntensity = 0;
				mat.clearcoat = 0.08;
				mat.roughness = 0.6;
				mat.transparent = false;
				mat.opacity = 1;
				mat.sheen = 0.1;
				mat.sheenColor.copy(SKIN_BASE);
			}

			mat.needsUpdate = true;
			for (const m of meshes) m.material = mat;
		}
	}

	// ── Idle breathing animation ──

	function updateBreathing(delta: number) {
		if (!sceneGroup) return;
		const breath = Math.sin(elapsedTime * 1.2) * 0.003;
		sceneGroup.position.y = breath;
		const tilt = Math.sin(elapsedTime * 0.8) * 0.005;
		sceneGroup.rotation.y = tilt;
	}

	// ── Podium energy ring glow ──

	function updatePodiumRing(delta: number) {
		if (!podiumRingRef) return;
		const mat = podiumRingRef.material as THREE.MeshPhysicalMaterial;
		const pulse = Math.sin(elapsedTime * 2.0) * 0.5 + 0.5;
		mat.emissiveIntensity = 0.3 + pulse * 0.5;
		mat.opacity = 0.4 + pulse * 0.3;
		mat.needsUpdate = true;
	}

	// ── Camera animation ──

	const CAMERA_TARGET = new THREE.Vector3(0, 1.1, 0);
	const CAM_DISTANCE = 2.4;
	const PRESETS: Record<CameraPreset, THREE.Vector3> = {
		front: new THREE.Vector3(0, 1.2, CAM_DISTANCE),
		back: new THREE.Vector3(0, 1.2, -CAM_DISTANCE),
		left: new THREE.Vector3(-CAM_DISTANCE, 1.2, 0),
		right: new THREE.Vector3(CAM_DISTANCE, 1.2, 0),
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

	function updateCamera(delta: number) {
		if (!cameraRef || !orbitRef) return;
		if (animating) {
			camCurrent.lerp(camTarget, 1 - Math.pow(0.001, delta));
			if (camCurrent.distanceTo(camTarget) < 0.005) {
				camCurrent.copy(camTarget);
				animating = false;
			}
			cameraRef.position.copy(camCurrent);
			orbitRef.target.copy(CAMERA_TARGET);
			orbitRef.update();
		} else {
			camCurrent.copy(cameraRef.position);
		}
	}

	// ── Main render loop ──

	useTask((delta) => {
		updateMaterials(delta);
		updateBreathing(delta);
		updatePodiumRing(delta);
		updateCamera(delta);
	});

	// ── Raycasting ──

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

	function onPointerUp() {
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
	position={[0, 1.2, 2.4]}
	fov={34}
	near={0.1}
	far={30}
>
	{#if allowOrbit}
		<OrbitControls
			bind:ref={orbitRef}
			enableDamping
			dampingFactor={0.08}
			minDistance={1.2}
			maxDistance={4.0}
			minPolarAngle={Math.PI * 0.1}
			maxPolarAngle={Math.PI * 0.85}
			target={[0, 1.1, 0]}
			enablePan={false}
			rotateSpeed={0.55}
			zoomSpeed={0.7}
		/>
	{/if}
</T.PerspectiveCamera>

<!-- ═══ Lighting: premium game character viewer rig ═══ -->

<!-- Ambient: soft warm fill -->
<T.AmbientLight intensity={0.35} color={0xfff5ee} />

<!-- Key light: warm, upper-right, main shadow source -->
<T.DirectionalLight
	position={[3, 5, 3.5]}
	intensity={1.1}
	color={0xfff0e0}
/>

<!-- Fill light: cool blue from left, softer -->
<T.DirectionalLight
	position={[-3.5, 2.5, 1.5]}
	intensity={0.45}
	color={0xc8d8f0}
/>

<!-- Colored rim light: pastel pink/magenta from back-right -->
<T.DirectionalLight
	position={[1.5, 3, -3.5]}
	intensity={0.6}
	color={0xffb0d0}
/>

<!-- Colored rim light: pastel cyan from back-left -->
<T.DirectionalLight
	position={[-1.5, 2.5, -3]}
	intensity={0.45}
	color={0xb0e0ff}
/>

<!-- Under-fill: warm bounce from below -->
<T.PointLight position={[0, 0.3, 1.5]} intensity={0.25} color={0xffe8d0} distance={5} />

<!-- Podium spotlight: focused downward -->
<T.SpotLight
	position={[0, 4, 0]}
	intensity={0.8}
	color={0xfff8f0}
	angle={0.35}
	penumbra={0.6}
	distance={8}
	target-position={[0, 0.5, 0]}
/>

<!-- Sky/ground hemisphere -->
<T.HemisphereLight args={[0xe8e0f8, 0xd0c8b8, 0.3]} />

<!-- ═══ Podium energy ring ═══ -->
<T.Mesh
	bind:ref={podiumRingRef}
	position={[0, 0.205, 0]}
	rotation.x={-Math.PI / 2}
>
	<T.TorusGeometry args={[0.30, 0.006, 12, 48]} />
	<T.MeshPhysicalMaterial
		color={0x88ccff}
		emissive={0x4488ff}
		emissiveIntensity={0.5}
		transparent
		opacity={0.6}
		roughness={0.2}
		metalness={0.4}
	/>
</T.Mesh>

<!-- ═══ Model ═══ -->
{#if $gltf}
	<T.Group bind:ref={sceneGroup}>
		<T is={$gltf.scene} />
	</T.Group>
{/if}
