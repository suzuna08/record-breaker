<script lang="ts">
	import AnatomySvg from '$lib/components/anatomy/AnatomySvg.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import type { MuscleGroup } from '$lib/types';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const highlightedKeys = $derived([
		...(data.primaryMuscles as MuscleGroup[]).map((m) => m.mesh_key),
		...(data.secondaryMuscles as MuscleGroup[]).map((m) => m.mesh_key),
	]);
</script>

<svelte:head>
	<title>{data.exercise?.name_en ?? 'Exercise'} — Gym Anatomy Tracker</title>
</svelte:head>

<div class="mx-auto max-w-5xl px-4 py-8">
	{#if !data.exercise}
		<p class="text-zinc-500">Exercise not found.</p>
	{:else}
		<div class="mb-6">
			<Button href="/exercises" variant="ghost" size="sm">← Back to Library</Button>
		</div>

		<div class="grid gap-8 lg:grid-cols-[1fr_280px]">
			<div>
				<h1 class="text-3xl font-bold text-zinc-50">{data.exercise.name_en}</h1>
				<p class="mt-1 text-lg text-zinc-400">{data.exercise.name_zh}</p>

				<div class="mt-4 flex flex-wrap gap-2">
					<span class="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">{data.exercise.equipment}</span>
					<span class="rounded-full bg-zinc-800/60 px-3 py-1 text-xs text-zinc-500">{data.exercise.category}</span>
				</div>

				{#if data.exercise.instructions}
					<div class="mt-6">
						<h2 class="mb-2 text-sm font-medium uppercase tracking-wider text-zinc-500">Instructions</h2>
						<p class="leading-relaxed text-zinc-300">{data.exercise.instructions}</p>
					</div>
				{/if}

				<div class="mt-6 grid gap-4 sm:grid-cols-2">
					<div class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
						<h3 class="mb-2 text-xs font-medium uppercase tracking-wider text-brand-400">Primary Muscles</h3>
						{#if (data.primaryMuscles as MuscleGroup[]).length === 0}
							<p class="text-sm text-zinc-500">—</p>
						{:else}
							<ul class="space-y-1">
								{#each data.primaryMuscles as muscle}
									<li class="text-sm">
										<a href="/anatomy" class="text-zinc-200 hover:text-brand-400">{muscle.name_en}</a>
										<span class="ml-1 text-xs text-zinc-500">{muscle.name_zh}</span>
									</li>
								{/each}
							</ul>
						{/if}
					</div>

					<div class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
						<h3 class="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">Secondary Muscles</h3>
						{#if (data.secondaryMuscles as MuscleGroup[]).length === 0}
							<p class="text-sm text-zinc-500">—</p>
						{:else}
							<ul class="space-y-1">
								{#each data.secondaryMuscles as muscle}
									<li class="text-sm">
										<a href="/anatomy" class="text-zinc-300 hover:text-brand-400">{muscle.name_en}</a>
										<span class="ml-1 text-xs text-zinc-500">{muscle.name_zh}</span>
									</li>
								{/each}
							</ul>
						{/if}
					</div>
				</div>
			</div>

			<!-- Mini anatomy view showing targeted muscles -->
			<div class="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
				<p class="mb-3 text-center text-xs font-medium uppercase tracking-wider text-zinc-500">Targeted Muscles</p>
				<AnatomySvg highlightedMeshKeys={highlightedKeys} />
			</div>
		</div>
	{/if}
</div>
