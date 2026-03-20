<script lang="ts">
	import type { AnatomyRegion } from '$lib/data/anatomy';
	import { REGION_COLORS } from '$lib/data/anatomy';
	import type { Exercise } from '$lib/types';

	interface Props {
		region: AnatomyRegion | null;
		exercises?: Exercise[];
		onExerciseClick?: (exercise: Exercise) => void;
	}

	let { region, exercises = [], onExerciseClick }: Props = $props();
</script>

<div class="flex h-full flex-col">
	{#if region}
		<div class="space-y-5">
			<div>
				<div class="flex items-center gap-3">
					<span
						class="inline-block h-3 w-3 rounded-full"
						style:background-color={REGION_COLORS[region.region]}
					></span>
					<h2 class="text-xl font-bold text-zinc-50">{region.name_en}</h2>
				</div>
				<p class="mt-1 text-lg text-zinc-300">{region.name_zh}</p>
			</div>

			<div class="rounded-lg border border-zinc-800 bg-zinc-800/30 p-3">
				<p class="text-xs font-medium uppercase tracking-wider text-zinc-500">Region</p>
				<p class="mt-0.5 text-sm capitalize text-zinc-300">{region.region}</p>
			</div>

			<div>
				<p class="text-xs font-medium uppercase tracking-wider text-zinc-500">Description</p>
				<p class="mt-1 text-sm leading-relaxed text-zinc-400">{region.description}</p>
			</div>

			<div>
				<p class="text-xs font-medium uppercase tracking-wider text-zinc-500">Mesh Key</p>
				<code class="mt-1 block rounded bg-zinc-800 px-2 py-1 font-mono text-xs text-zinc-400">{region.mesh_key}</code>
			</div>

			{#if exercises.length > 0}
				<div>
					<p class="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
						Common Exercises ({exercises.length})
					</p>
					<ul class="space-y-1.5">
						{#each exercises as exercise}
							<li>
								<button
									class="w-full rounded-lg border border-zinc-800 bg-zinc-800/30 px-3 py-2 text-left text-sm transition hover:border-zinc-700 hover:bg-zinc-800/60"
									onclick={() => onExerciseClick?.(exercise)}
								>
									<span class="text-zinc-200">{exercise.name_en}</span>
									<span class="ml-2 text-xs text-zinc-500">{exercise.name_zh}</span>
								</button>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	{:else}
		<div class="flex flex-1 flex-col items-center justify-center text-center">
			<div class="mb-3 text-4xl opacity-30">◉</div>
			<p class="text-sm text-zinc-500">Click a muscle region to view details</p>
			<p class="mt-1 text-xs text-zinc-600">點擊肌肉區域查看詳情</p>
		</div>
	{/if}
</div>
