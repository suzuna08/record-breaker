<script lang="ts">
	/**
	 * MuscleCharacter3D — Stylized game-like 3D fitness character viewer.
	 *
	 * Pokemon-inspired presentation with toon shading, glow highlights,
	 * display podium, and premium mobile-game UI polish.
	 *
	 * Drop-in replacement for MuscleBody3D with identical prop interface.
	 * SSR-safe: Canvas + Three.js loaded only on client via dynamic import.
	 *
	 * HOW TO PLUG IN A CUSTOM STYLIZED GLB:
	 *   1. Place your artist-made .glb in  static/models/
	 *   2. Pass  modelUrl="/models/your-model.glb"
	 *   3. Either:
	 *      (a) Name GLB meshes to match mesh_keys, OR
	 *      (b) Add entries to  GLB_TO_MESH_KEY  in  src/lib/data/mesh-key-map.ts
	 *   4. Body/skeleton meshes should start with "__" (ignored by mesh resolver)
	 *   5. Podium mesh should be named "__podium"
	 *
	 * HOW TO SWAP INTO A PAGE:
	 *   Replace  <MuscleBody3D .../>  with  <MuscleCharacter3D .../> — same props.
	 */
	import { browser } from '$app/environment';
	import { getRegionForKey } from '$lib/data/mesh-key-map';
	import { getRegionStyle } from '$lib/data/muscle-regions';

	type CameraPreset = 'front' | 'back' | 'left' | 'right';

	interface Props {
		modelUrl?: string;
		highlightedMeshKeys?: string[];
		primaryMeshKeys?: string[];
		secondaryMeshKeys?: string[];
		selectedMeshKey?: string | null;
		view?: 'front' | 'back';
		onMuscleClick?: (meshKey: string) => void;
		compact?: boolean;
		allowOrbit?: boolean;
		showViewControls?: boolean;
	}

	let {
		modelUrl = '/models/stylized-character.glb',
		highlightedMeshKeys = [],
		primaryMeshKeys = [],
		secondaryMeshKeys = [],
		selectedMeshKey = null,
		view = 'front',
		onMuscleClick,
		compact = false,
		allowOrbit = true,
		showViewControls = true,
	}: Props = $props();

	let activePreset = $state<CameraPreset>('front');
	let hoveredMeshKey = $state<string | null>(null);
	let ready = $state(false);

	$effect(() => {
		if (view === 'front' || view === 'back') activePreset = view;
	});

	const hoveredRegion = $derived(
		hoveredMeshKey ? getRegionForKey(hoveredMeshKey) : null
	);
	const hoveredStyle = $derived(
		hoveredMeshKey ? getRegionStyle(hoveredMeshKey) : null
	);

	const isPrimary = (k: string) => primaryMeshKeys.includes(k);
	const isSecondary = (k: string) => secondaryMeshKeys.includes(k);

	const presets: { key: CameraPreset; label: string; icon: string }[] = [
		{ key: 'front', label: 'Front', icon: '👤' },
		{ key: 'back', label: 'Back', icon: '🔙' },
		{ key: 'left', label: 'Left', icon: '◀' },
		{ key: 'right', label: 'Right', icon: '▶' },
	];

	// SSR-safe dynamic imports
	let Canvas: any = $state(null);
	let MuscleCharacterScene: any = $state(null);

	$effect(() => {
		if (!browser) return;
		Promise.all([
			import('@threlte/core').then((m) => m.Canvas),
			import('./MuscleCharacterScene.svelte').then((m) => m.default),
		]).then(([c, s]) => {
			Canvas = c;
			MuscleCharacterScene = s;
			ready = true;
		});
	});
</script>

<div
	class="relative mx-auto select-none"
	class:max-w-[300px]={compact}
	class:max-w-[600px]={!compact}
>
	<!-- ═══ Camera preset buttons ═══ -->
	{#if showViewControls}
		<div class="mb-3 flex justify-center gap-1 rounded-xl
			bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90
			p-1 backdrop-blur-md border border-white/5 shadow-lg shadow-black/20">
			{#each presets as p}
				<button
					class="flex-1 rounded-lg px-3 py-2 text-[11px] font-semibold tracking-wide
						transition-all duration-300 ease-out
						{activePreset === p.key
							? 'bg-gradient-to-b from-indigo-500/30 to-purple-500/20 text-white shadow-md shadow-indigo-500/15 border border-indigo-400/20'
							: 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'}"
					onclick={() => activePreset = p.key}
				>
					<span class="mr-1 text-xs">{p.icon}</span>
					{p.label}
				</button>
			{/each}
		</div>
	{/if}

	<!-- ═══ 3D Canvas ═══ -->
	<div
		class="relative overflow-hidden rounded-2xl
			bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
			border border-white/5 shadow-2xl shadow-black/30"
		style:aspect-ratio={compact ? '2/3' : '4/5'}
	>
		<!-- Decorative corner accents -->
		<div class="pointer-events-none absolute inset-0 z-[1]">
			<div class="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-indigo-400/20 rounded-tl-2xl"></div>
			<div class="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-purple-400/20 rounded-tr-2xl"></div>
			<div class="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-cyan-400/15 rounded-bl-2xl"></div>
			<div class="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-pink-400/15 rounded-br-2xl"></div>
		</div>

		<!-- Soft radial vignette -->
		<div class="pointer-events-none absolute inset-0 z-[1]
			bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.3)_100%)]">
		</div>

		{#if ready && Canvas && MuscleCharacterScene}
			<Canvas
				autoRender
				toneMapping={4}
				colorManagement
			>
				<MuscleCharacterScene
					{modelUrl}
					{highlightedMeshKeys}
					{primaryMeshKeys}
					{secondaryMeshKeys}
					{selectedMeshKey}
					{allowOrbit}
					cameraPreset={activePreset}
					onMuscleClick={(k: string) => onMuscleClick?.(k)}
					onMuscleHover={(k: string | null) => { hoveredMeshKey = k; }}
				/>
			</Canvas>
		{:else}
			<div class="flex h-full items-center justify-center">
				<div class="text-center">
					<div class="mx-auto mb-4 h-10 w-10 rounded-full
						border-2 border-indigo-400/30 border-t-indigo-400
						animate-spin"></div>
					<p class="text-xs font-medium text-slate-400 tracking-wide">Loading character…</p>
					<div class="mt-2 flex justify-center gap-1">
						<div class="h-1 w-1 rounded-full bg-indigo-400/40 animate-pulse"></div>
						<div class="h-1 w-1 rounded-full bg-purple-400/40 animate-pulse" style="animation-delay: 0.2s"></div>
						<div class="h-1 w-1 rounded-full bg-cyan-400/40 animate-pulse" style="animation-delay: 0.4s"></div>
					</div>
				</div>
			</div>
		{/if}

		<!-- ═══ Hover tooltip (game-style floating label) ═══ -->
		{#if hoveredRegion && hoveredStyle}
			<div class="pointer-events-none absolute left-1/2 top-4 z-10 -translate-x-1/2
				rounded-xl border border-white/10
				bg-slate-900/90 backdrop-blur-lg
				px-4 py-2.5 text-center
				shadow-2xl shadow-black/30
				transition-all duration-150 ease-out">
				<p class="text-sm font-bold text-white tracking-wide">{hoveredRegion.name_en}</p>
				<p class="text-[10px] font-medium text-slate-400 mt-0.5">{hoveredRegion.name_zh}</p>
				{#if isPrimary(hoveredRegion.mesh_key)}
					<span class="mt-1.5 inline-flex items-center gap-1 rounded-full
						bg-red-500/15 px-2.5 py-0.5 text-[9px] font-bold text-red-300 tracking-wider uppercase">
						<span class="h-1.5 w-1.5 rounded-full bg-red-400 shadow-sm shadow-red-400/50"></span>
						Primary
					</span>
				{:else if isSecondary(hoveredRegion.mesh_key)}
					<span class="mt-1.5 inline-flex items-center gap-1 rounded-full
						bg-amber-500/15 px-2.5 py-0.5 text-[9px] font-bold text-amber-300 tracking-wider uppercase">
						<span class="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50"></span>
						Secondary
					</span>
				{/if}
			</div>
		{/if}

		<!-- ═══ Orbit hint ═══ -->
		{#if allowOrbit}
			<div class="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 z-10
				rounded-full bg-black/40 backdrop-blur-sm
				px-3.5 py-1.5 text-[9px] font-medium text-slate-300/70 tracking-wide
				border border-white/5">
				Drag to rotate · Scroll to zoom
			</div>
		{/if}

		<!-- ═══ Selected muscle indicator (bottom-left badge) ═══ -->
		{#if selectedMeshKey}
			{@const selRegion = getRegionForKey(selectedMeshKey)}
			{@const selStyle = getRegionStyle(selectedMeshKey)}
			{#if selRegion}
				<div class="absolute bottom-3 left-3 z-10
					rounded-xl border border-white/10
					bg-slate-900/85 backdrop-blur-lg
					px-3 py-2 shadow-xl shadow-black/20">
					<div class="flex items-center gap-2">
						<div class="h-3 w-3 rounded-full shadow-lg animate-pulse"
							style="background: #{selStyle.glowColor.toString(16).padStart(6, '0')};
								box-shadow: 0 0 8px #{selStyle.glowColor.toString(16).padStart(6, '0')}66;">
						</div>
						<div>
							<p class="text-[10px] font-bold text-white">{selRegion.name_en}</p>
							<p class="text-[8px] text-slate-400">{selStyle.label}</p>
						</div>
					</div>
				</div>
			{/if}
		{/if}
	</div>

	<!-- ═══ Legend ═══ -->
	{#if primaryMeshKeys.length > 0 || secondaryMeshKeys.length > 0}
		<div class="mt-3 flex items-center justify-center gap-6 text-[10px] font-medium text-slate-400">
			{#if primaryMeshKeys.length > 0}
				<span class="flex items-center gap-2">
					<span class="relative flex h-2.5 w-2.5">
						<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-50"></span>
						<span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-400 shadow-sm shadow-red-400/40"></span>
					</span>
					<span class="tracking-wide uppercase">Primary</span>
				</span>
			{/if}
			{#if secondaryMeshKeys.length > 0}
				<span class="flex items-center gap-2">
					<span class="inline-block h-2.5 w-2.5 rounded-full bg-amber-400/60"></span>
					<span class="tracking-wide uppercase">Secondary</span>
				</span>
			{/if}
		</div>
	{/if}
</div>
