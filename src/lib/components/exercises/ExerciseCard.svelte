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
	class="group w-full rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-left transition hover:border-zinc-700 hover:bg-zinc-800/60"
	{onclick}
>
	<div class="flex items-start justify-between">
		<div class="min-w-0 flex-1">
			<h3 class="font-semibold text-zinc-100 group-hover:text-brand-400 transition">{exercise.name_en}</h3>
			<p class="mt-0.5 text-sm text-zinc-400">{exercise.name_zh}</p>
		</div>
		<div class="ml-3 flex flex-col items-end gap-1">
			<span class="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">{exercise.equipment}</span>
			<span class="rounded-full bg-zinc-800/60 px-2 py-0.5 text-xs text-zinc-500">{exercise.category}</span>
		</div>
	</div>

	{#if primaryMuscles.length > 0 || secondaryMuscles.length > 0}
		<div class="mt-3 flex flex-wrap gap-1.5">
			{#each primaryMuscles as muscle}
				<span class="rounded-full bg-brand-600/20 px-2 py-0.5 text-xs text-brand-300">{muscle}</span>
			{/each}
			{#each secondaryMuscles as muscle}
				<span class="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-500">{muscle}</span>
			{/each}
		</div>
	{/if}
</button>
