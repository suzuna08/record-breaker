<script lang="ts">
	import { ANATOMY_REGIONS, REGION_COLORS, type AnatomyRegion } from '$lib/data/anatomy';

	interface Props {
		selectedMeshKey?: string | null;
		highlightedMeshKeys?: string[];
		onSelect?: (region: AnatomyRegion) => void;
	}

	let { selectedMeshKey = null, highlightedMeshKeys = [], onSelect }: Props = $props();
	let hoveredKey = $state<string | null>(null);

	function isHighlighted(key: string): boolean {
		return highlightedMeshKeys.includes(key);
	}

	function getFill(region: AnatomyRegion): string {
		const base = REGION_COLORS[region.region] || '#6b7280';
		if (region.mesh_key === selectedMeshKey) return base;
		if (region.mesh_key === hoveredKey) return base + 'cc';
		if (isHighlighted(region.mesh_key)) return base + '88';
		return base + '33';
	}

	function getStroke(region: AnatomyRegion): string {
		if (region.mesh_key === selectedMeshKey) return '#ffffff';
		if (region.mesh_key === hoveredKey) return '#ffffff88';
		return 'transparent';
	}
</script>

<div class="relative aspect-[1/2] w-full max-w-[320px] mx-auto select-none">
	<svg viewBox="0 0 100 100" class="h-full w-full">
		<!-- Body silhouette outline -->
		<ellipse cx="50" cy="10" rx="8" ry="8" fill="#27272a" stroke="#3f3f46" stroke-width="0.3" />
		<rect x="38" y="17" width="24" height="30" rx="5" fill="#27272a" stroke="#3f3f46" stroke-width="0.3" />
		<!-- Arms -->
		<rect x="20" y="20" width="8" height="28" rx="3" fill="#27272a" stroke="#3f3f46" stroke-width="0.3" transform="rotate(-5, 24, 34)" />
		<rect x="72" y="20" width="8" height="28" rx="3" fill="#27272a" stroke="#3f3f46" stroke-width="0.3" transform="rotate(5, 76, 34)" />
		<!-- Legs -->
		<rect x="38" y="50" width="10" height="35" rx="4" fill="#27272a" stroke="#3f3f46" stroke-width="0.3" />
		<rect x="52" y="50" width="10" height="35" rx="4" fill="#27272a" stroke="#3f3f46" stroke-width="0.3" />
		<!-- Calves -->
		<rect x="39" y="78" width="8" height="16" rx="3" fill="#27272a" stroke="#3f3f46" stroke-width="0.3" />
		<rect x="53" y="78" width="8" height="16" rx="3" fill="#27272a" stroke="#3f3f46" stroke-width="0.3" />

		<!-- Muscle regions -->
		{#each ANATOMY_REGIONS as region}
			<ellipse
				cx={region.cx}
				cy={region.cy}
				rx={region.rx}
				ry={region.ry}
				fill={getFill(region)}
				stroke={getStroke(region)}
				stroke-width="0.5"
				class="cursor-pointer transition-all duration-200"
				role="button"
				tabindex="0"
				onmouseenter={() => hoveredKey = region.mesh_key}
				onmouseleave={() => hoveredKey = null}
				onclick={() => onSelect?.(region)}
				onkeydown={(e) => e.key === 'Enter' && onSelect?.(region)}
			>
				<title>{region.name_en} / {region.name_zh}</title>
			</ellipse>
		{/each}
	</svg>

	<!-- Hover tooltip -->
	{#if hoveredKey && hoveredKey !== selectedMeshKey}
		{@const hovered = ANATOMY_REGIONS.find((r) => r.mesh_key === hoveredKey)}
		{#if hovered}
			<div class="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs text-zinc-200 shadow-lg">
				{hovered.name_en} <span class="text-zinc-400">/ {hovered.name_zh}</span>
			</div>
		{/if}
	{/if}
</div>
