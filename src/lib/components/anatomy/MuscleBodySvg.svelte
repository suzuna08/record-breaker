<script lang="ts">
	import {
		FRONT_MUSCLES,
		BACK_MUSCLES,
		FRONT_BODY_OUTLINE,
		BACK_BODY_OUTLINE,
		FRONT_HEAD,
		BACK_HEAD,
		type MusclePath,
	} from '$lib/data/muscle-paths';
	import { REGION_COLORS } from '$lib/data/anatomy';

	interface Props {
		view?: 'front' | 'back';
		highlightedMeshKeys?: string[];
		primaryMeshKeys?: string[];
		secondaryMeshKeys?: string[];
		selectedMeshKey?: string | null;
		onSelect?: (muscle: MusclePath) => void;
		onToggleView?: (view: 'front' | 'back') => void;
		showViewToggle?: boolean;
		compact?: boolean;
	}

	let {
		view = $bindable('front'),
		highlightedMeshKeys = [],
		primaryMeshKeys = [],
		secondaryMeshKeys = [],
		selectedMeshKey = null,
		onSelect,
		onToggleView,
		showViewToggle = true,
		compact = false,
	}: Props = $props();

	let hoveredKey = $state<string | null>(null);

	const muscles = $derived(view === 'front' ? FRONT_MUSCLES : BACK_MUSCLES);
	const bodyOutline = $derived(view === 'front' ? FRONT_BODY_OUTLINE : BACK_BODY_OUTLINE);
	const headOutline = $derived(view === 'front' ? FRONT_HEAD : BACK_HEAD);

	function isPrimary(key: string): boolean {
		return primaryMeshKeys.includes(key);
	}

	function isSecondary(key: string): boolean {
		return secondaryMeshKeys.includes(key);
	}

	function isHighlighted(key: string): boolean {
		return highlightedMeshKeys.includes(key) || isPrimary(key) || isSecondary(key);
	}

	function getFill(muscle: MusclePath): string {
		const base = REGION_COLORS[muscle.region] || '#6b7280';
		if (muscle.mesh_key === selectedMeshKey) return base;
		if (muscle.mesh_key === hoveredKey) return base + 'dd';
		if (isPrimary(muscle.mesh_key)) return base;
		if (isSecondary(muscle.mesh_key)) return base + '99';
		if (isHighlighted(muscle.mesh_key)) return base + '66';
		return '#c8c4c0';
	}

	function getOpacity(muscle: MusclePath): number {
		if (muscle.mesh_key === selectedMeshKey) return 0.95;
		if (muscle.mesh_key === hoveredKey) return 0.85;
		if (isPrimary(muscle.mesh_key)) return 0.9;
		if (isSecondary(muscle.mesh_key)) return 0.65;
		if (isHighlighted(muscle.mesh_key)) return 0.5;
		return 0.4;
	}

	function getStroke(muscle: MusclePath): string {
		if (muscle.mesh_key === selectedMeshKey) return '#ffffff';
		if (muscle.mesh_key === hoveredKey) return '#ffffff88';
		if (isPrimary(muscle.mesh_key)) return '#ffffff33';
		if (isSecondary(muscle.mesh_key)) return '#ffffff22';
		return '#a8a4a044';
	}

	function handleMuscleClick(muscle: MusclePath) {
		onSelect?.(muscle);
	}

	const hoveredMuscle = $derived(
		hoveredKey ? muscles.find((m) => m.mesh_key === hoveredKey) : null
	);
</script>

<div class="relative mx-auto select-none" class:max-w-[220px]={compact} class:max-w-[320px]={!compact}>
	{#if showViewToggle}
		<div class="mb-3 flex justify-center gap-1 rounded-lg bg-zinc-800/40 p-1">
			<button
				class="flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200
					{view === 'front' ? 'bg-zinc-700 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}"
				onclick={() => { view = 'front'; onToggleView?.('front'); }}
			>
				Front
			</button>
			<button
				class="flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200
					{view === 'back' ? 'bg-zinc-700 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}"
				onclick={() => { view = 'back'; onToggleView?.('back'); }}
			>
				Back
			</button>
		</div>
	{/if}

	<div class="relative">
		<svg viewBox="20 0 160 396" class="h-full w-full drop-shadow-lg" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<filter id="muscle-glow">
					<feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
					<feMerge>
						<feMergeNode in="blur" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
				<linearGradient id="body-grad" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stop-color="#d4d0cc" />
					<stop offset="50%" stop-color="#c8c4c0" />
					<stop offset="100%" stop-color="#bfbbb7" />
				</linearGradient>
				<radialGradient id="head-grad" cx="50%" cy="40%" r="50%">
					<stop offset="0%" stop-color="#ddd9d5" />
					<stop offset="100%" stop-color="#c8c4c0" />
				</radialGradient>
				{#each Object.entries(REGION_COLORS) as [region, color]}
					<linearGradient id="mg-{region}" x1="0" y1="0" x2="0.2" y2="1">
						<stop offset="0%" stop-color={color} stop-opacity="1" />
						<stop offset="100%" stop-color={color} stop-opacity="0.7" />
					</linearGradient>
				{/each}
			</defs>

			<!-- Body silhouette -->
			<path
				d={bodyOutline}
				fill="url(#body-grad)"
				stroke="#a8a4a0"
				stroke-width="0.6"
			/>

			<!-- Head (slightly brighter) -->
			<path
				d={headOutline}
				fill="url(#head-grad)"
				stroke="#a8a4a0"
				stroke-width="0.5"
			/>

			<!-- Subtle body detail lines -->
			<line x1="100" y1="42" x2="100" y2="152" stroke="#b8b4b018" stroke-width="0.4" stroke-dasharray="3,4" />

			<!-- Clavicle line -->
			<path d="M 68,48 Q 84,44 100,46 Q 116,44 132,48" fill="none" stroke="#a8a4a030" stroke-width="0.4" />

			<!-- Navel dot -->
			{#if view === 'front'}
				<circle cx="100" cy="116" r="1.2" fill="#b8b4b0" stroke="#a8a4a044" stroke-width="0.3" />
			{/if}

			<!-- Muscle groups with interactivity -->
			{#each muscles as muscle (muscle.mesh_key)}
				{@const fill = getFill(muscle)}
				{@const opacity = getOpacity(muscle)}
				{@const stroke = getStroke(muscle)}
				{@const active = isPrimary(muscle.mesh_key) || isSecondary(muscle.mesh_key) || muscle.mesh_key === selectedMeshKey}

				<g
					class="cursor-pointer"
					style="transition: opacity 0.3s ease, filter 0.3s ease"
					role="button"
					tabindex="0"
					onmouseenter={() => hoveredKey = muscle.mesh_key}
					onmouseleave={() => hoveredKey = null}
					onclick={() => handleMuscleClick(muscle)}
					onkeydown={(e) => e.key === 'Enter' && handleMuscleClick(muscle)}
					style:filter={active && hoveredKey === muscle.mesh_key ? 'url(#muscle-glow)' : 'none'}
				>
					{#each muscle.paths as path}
						<path
							d={path}
							fill={fill}
							fill-opacity={opacity}
							stroke={stroke}
							stroke-width={active ? '0.5' : '0.25'}
							stroke-linejoin="round"
						/>
					{/each}
					{#if muscle.mirror}
						{#each muscle.mirror as path}
							<path
								d={path}
								fill={fill}
								fill-opacity={opacity}
								stroke={stroke}
								stroke-width={active ? '0.5' : '0.25'}
								stroke-linejoin="round"
							/>
						{/each}
					{/if}
					<title>{muscle.name_en} / {muscle.name_zh}</title>
				</g>
			{/each}
		</svg>

		<!-- Hover tooltip -->
		{#if hoveredMuscle}
			<div
				class="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-lg border border-zinc-700/50 bg-zinc-800/95 px-3 py-2 text-center shadow-xl backdrop-blur-sm"
				style:top={compact ? '-4px' : '2px'}
			>
				<p class="text-xs font-medium text-zinc-100">{hoveredMuscle.name_en}</p>
				<p class="text-[10px] text-zinc-400">{hoveredMuscle.name_zh}</p>
				{#if isPrimary(hoveredMuscle.mesh_key)}
					<span class="mt-1 inline-block rounded-full bg-red-500/20 px-2 py-0.5 text-[9px] font-medium text-red-400">Primary</span>
				{:else if isSecondary(hoveredMuscle.mesh_key)}
					<span class="mt-1 inline-block rounded-full bg-amber-500/20 px-2 py-0.5 text-[9px] font-medium text-amber-400">Secondary</span>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Legend -->
	{#if primaryMeshKeys.length > 0 || secondaryMeshKeys.length > 0}
		<div class="mt-3 flex items-center justify-center gap-4 text-[10px] text-zinc-500">
			{#if primaryMeshKeys.length > 0}
				<span class="flex items-center gap-1.5">
					<span class="inline-block h-2.5 w-2.5 rounded-sm bg-red-500/90"></span>
					Primary
				</span>
			{/if}
			{#if secondaryMeshKeys.length > 0}
				<span class="flex items-center gap-1.5">
					<span class="inline-block h-2.5 w-2.5 rounded-sm bg-amber-500/60"></span>
					Secondary
				</span>
			{/if}
		</div>
	{/if}
</div>
