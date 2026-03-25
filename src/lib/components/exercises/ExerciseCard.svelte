<script lang="ts">
	import type { Exercise } from '$lib/types';

	interface Props {
		exercise: Exercise;
		primaryMuscles?: string[];
		secondaryMuscles?: string[];
		onclick?: () => void;
	}

	let { exercise, primaryMuscles = [], secondaryMuscles = [], onclick }: Props = $props();
</script>

<button
	class="group w-full rounded-2xl p-4 text-left transition-all duration-200
		border border-white/5 hover:border-sakura-400/20
		hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sakura-500/10"
	style="background: linear-gradient(145deg, rgba(42, 31, 61, 0.6), rgba(30, 21, 48, 0.8)); backdrop-filter: blur(8px);"
	{onclick}
>
	<div class="flex items-start justify-between">
		<div class="min-w-0 flex-1">
			<h3 class="font-bold text-white/90 group-hover:text-sakura-300 transition">{exercise.name_en}</h3>
			<p class="mt-0.5 text-xs text-white/30">{exercise.name_zh}</p>
		</div>
		<div class="ml-3 flex flex-col items-end gap-1">
			<span class="rounded-full bg-white/5 border border-white/8 px-2 py-0.5 text-[10px] font-medium text-white/40">{exercise.equipment}</span>
			<span class="rounded-full bg-white/5 border border-white/8 px-2 py-0.5 text-[10px] text-white/25">{exercise.category}</span>
		</div>
	</div>

	{#if primaryMuscles.length > 0 || secondaryMuscles.length > 0}
		<div class="mt-3 flex flex-wrap gap-1.5">
			{#each primaryMuscles as muscle}
				<span class="rounded-full bg-sakura-500/15 border border-sakura-400/15 px-2 py-0.5 text-[10px] font-bold text-sakura-300">{muscle}</span>
			{/each}
			{#each secondaryMuscles as muscle}
				<span class="rounded-full bg-white/5 border border-white/8 px-2 py-0.5 text-[10px] text-white/30">{muscle}</span>
			{/each}
		</div>
	{/if}
</button>
