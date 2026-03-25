<script lang="ts">
	/**
	 * MuscleBody3D — Premium interactive 3D muscle anatomy viewer.
	 *
	 * Drop-in replacement for MuscleBodySvg with compatible prop interface.
	 * SSR-safe: Canvas + Three.js loaded only on client via dynamic import.
	 *
	 * HOW TO PLUG IN A REAL GLB MODEL:
	 *   1. Place your artist-made .glb in  static/models/
	 *   2. Pass  modelUrl="/models/your-model.glb"
	 *   3. Either:
	 *      (a) Name GLB meshes to match mesh_keys (e.g. "chest_pectoralis_major"), OR
	 *      (b) Add entries to  GLB_TO_MESH_KEY  in  src/lib/data/mesh-key-map.ts
	 *   4. Body/skeleton meshes should start with "__" (ignored by mesh resolver)
	 *
	 * HOW TO SWAP INTO A PAGE:
	 *   Replace  <MuscleBodySvg .../>  with  <MuscleBody3D .../> — same props.
	 */
	import { browser } from '$app/environment';
	import { getRegionForKey } from '$lib/data/mesh-key-map';

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
		modelUrl = '/models/muscle-body.glb',
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

	let activePreset = $state<CameraPreset>(view as CameraPreset);
	let hoveredMeshKey = $state<string | null>(null);
	let ready = $state(false);

	// Sync external view prop
	$effect(() => {
		if (view === 'front' || view === 'back') activePreset = view;
	});

	const hoveredRegion = $derived(
		hoveredMeshKey ? getRegionForKey(hoveredMeshKey) : null
	);

	const isPrimary = (k: string) => primaryMeshKeys.includes(k);
	const isSecondary = (k: string) => secondaryMeshKeys.includes(k);

	const presets: { key: CameraPreset; label: string }[] = [
		{ key: 'front', label: 'Front' },
		{ key: 'back', label: 'Back' },
		{ key: 'left', label: 'Left' },
		{ key: 'right', label: 'Right' },
	];

	// SSR-safe dynamic imports
	let Canvas: any = $state(null);
	let MuscleScene: any = $state(null);

	$effect(() => {
		if (!browser) return;
		Promise.all([
			import('@threlte/core').then((m) => m.Canvas),
			import('./MuscleScene.svelte').then((m) => m.default),
		]).then(([c, s]) => {
			Canvas = c;
			MuscleScene = s;
			ready = true;
		});
	});
</script>

<div
	class="relative mx-auto select-none"
	class:max-w-[300px]={compact}
	class:max-w-[560px]={!compact}
>
	<!-- Preset buttons -->
	{#if showViewControls}
		<div class="mb-3 flex justify-center gap-1 rounded-lg bg-white p-1 backdrop-blur-sm">
			{#each presets as p}
				<button
					class="flex-1 rounded-md px-2.5 py-1.5 text-[11px] font-medium tracking-wide transition-all duration-200
						{activePreset === p.key
							? 'bg-zinc-200 text-zinc-900 shadow-md shadow-zinc-200/50'
							: 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100'}"
					onclick={() => activePreset = p.key}
				>
					{p.label}
				</button>
			{/each}
		</div>
	{/if}

	<!-- 3D Canvas -->
	<div
		class="relative overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100"
		style:aspect-ratio={compact ? '2/3' : '4/5'}
	>
		{#if ready && Canvas && MuscleScene}
			<svelte:component this={Canvas}
				autoRender
				toneMapping={4}
				colorManagement
			>
				<svelte:component
					this={MuscleScene}
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
			</svelte:component>
		{:else}
			<div class="flex h-full items-center justify-center">
				<div class="text-center">
					<div class="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-400"></div>
					<p class="text-xs text-zinc-400">Loading anatomy model…</p>
				</div>
			</div>
		{/if}

		<!-- Hover tooltip -->
		{#if hoveredRegion}
			<div class="pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2
				rounded-lg border border-zinc-300/40 bg-white/90 px-3 py-2
				text-center shadow-2xl shadow-zinc-300/40 backdrop-blur-md
				transition-opacity duration-150">
				<p class="text-xs font-semibold text-zinc-800">{hoveredRegion.name_en}</p>
				<p class="text-[10px] text-zinc-400">{hoveredRegion.name_zh}</p>
				{#if isPrimary(hoveredRegion.mesh_key)}
					<span class="mt-1 inline-block rounded-full bg-red-500/15 px-2 py-0.5 text-[9px] font-semibold text-red-400">Primary</span>
				{:else if isSecondary(hoveredRegion.mesh_key)}
					<span class="mt-1 inline-block rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-semibold text-amber-400">Secondary</span>
				{/if}
			</div>
		{/if}

		<!-- Orbit hint (fades out) -->
		{#if allowOrbit}
			<div class="pointer-events-none absolute bottom-2.5 left-1/2 -translate-x-1/2
				rounded-full bg-white/80 px-3 py-1 text-[9px] text-zinc-400 backdrop-blur-sm">
				Drag to rotate · Scroll to zoom
			</div>
		{/if}
	</div>

	<!-- Legend -->
	{#if primaryMeshKeys.length > 0 || secondaryMeshKeys.length > 0}
		<div class="mt-3 flex items-center justify-center gap-5 text-[10px] text-zinc-400">
			{#if primaryMeshKeys.length > 0}
				<span class="flex items-center gap-1.5">
					<span class="inline-block h-2 w-2 rounded-full bg-red-500 shadow-sm shadow-red-500/40"></span>
					Primary
				</span>
			{/if}
			{#if secondaryMeshKeys.length > 0}
				<span class="flex items-center gap-1.5">
					<span class="inline-block h-2 w-2 rounded-full bg-red-400/50"></span>
					Secondary
				</span>
			{/if}
		</div>
	{/if}
</div>
