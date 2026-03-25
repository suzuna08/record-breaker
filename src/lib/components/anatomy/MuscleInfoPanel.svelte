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
						class="inline-block h-3.5 w-3.5 rounded-full shadow-lg"
						style="background-color: {REGION_COLORS[region.region]}; box-shadow: 0 0 12px {REGION_COLORS[region.region]}66;"
					></span>
					<h2 class="text-xl font-extrabold text-parchment-50">{region.name_en}</h2>
				</div>
				<p class="mt-1 text-base font-medium text-white/40">{region.name_zh}</p>
			</div>

			<div class="rounded-xl border border-white/8 bg-white/5 p-3">
				<p class="text-[10px] font-bold uppercase tracking-widest text-white/25">Region</p>
				<p class="mt-0.5 text-sm font-bold capitalize text-white/60">{region.region}</p>
			</div>

			<div>
				<p class="text-[10px] font-bold uppercase tracking-widest text-white/25">Description</p>
				<p class="mt-1.5 text-sm leading-relaxed text-white/50">{region.description}</p>
			</div>

			<div>
				<p class="text-[10px] font-bold uppercase tracking-widest text-white/25">Mesh Key</p>
				<code class="mt-1 block rounded-lg bg-white/5 border border-white/8 px-3 py-1.5 font-mono text-xs text-sakura-300/60">{region.mesh_key}</code>
			</div>

			{#if exercises.length > 0}
				<div>
					<p class="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-white/25">
						Common Exercises ({exercises.length})
					</p>
					<ul class="space-y-1.5">
						{#each exercises as exercise}
							<li>
								<button
									class="w-full rounded-xl border border-white/8 bg-white/5 px-3.5 py-2.5 text-left text-sm transition-all
										hover:border-sakura-400/20 hover:bg-sakura-500/8 hover:-translate-y-px"
									onclick={() => onExerciseClick?.(exercise)}
								>
									<span class="font-bold text-white/70">{exercise.name_en}</span>
									<span class="ml-2 text-[10px] text-white/25">{exercise.name_zh}</span>
								</button>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	{:else}
		<div class="flex flex-1 flex-col items-center justify-center text-center">
			<div class="mb-4 text-5xl opacity-20">💪</div>
			<p class="text-sm font-bold text-white/25">Click a muscle region to view details</p>
			<p class="mt-1 text-xs text-white/15">點擊肌肉區域查看詳情</p>
		</div>
	{/if}
</div>
