<script lang="ts">
	import CharacterViewer from '$lib/components/anatomy/CharacterViewer.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import type { MuscleGroup } from '$lib/types';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const primaryKeys = $derived(
		(data.primaryMuscles as MuscleGroup[]).map((m) => m.mesh_key)
	);
	const secondaryKeys = $derived(
		(data.secondaryMuscles as MuscleGroup[]).map((m) => m.mesh_key)
	);
</script>

<svelte:head>
	<title>{data.exercise?.name_en ?? 'Exercise'} — Record Breaker</title>
</svelte:head>

<div class="mx-auto max-w-5xl px-4 py-8">
	{#if !data.exercise}
		<p class="text-white/40">Exercise not found.</p>
	{:else}
		<div class="mb-6">
			<Button href="/exercises" variant="ghost" size="sm">← Back to Library</Button>
		</div>

		<div class="grid gap-8 lg:grid-cols-[1fr_280px]">
			<div>
				<h1 class="text-3xl font-bold text-white">{data.exercise.name_en}</h1>
				<p class="mt-1 text-lg text-white/40">{data.exercise.name_zh}</p>

				<div class="mt-4 flex flex-wrap gap-2">
					<span class="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-xs text-white/40">{data.exercise.equipment}</span>
					<span class="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-xs text-white/40">{data.exercise.category}</span>
				</div>

				{#if data.exercise.instructions}
					<div class="panel-glass mt-6 p-5">
						<h2 class="mb-2 text-sm font-medium uppercase tracking-wider text-white/30">Instructions</h2>
						<p class="leading-relaxed text-white/60">{data.exercise.instructions}</p>
					</div>
				{/if}

				<div class="mt-6 grid gap-4 sm:grid-cols-2">
					<div class="panel-glass p-4">
						<h3 class="mb-2 text-xs font-medium uppercase tracking-wider text-sakura-300">Primary Muscles</h3>
						{#if (data.primaryMuscles as MuscleGroup[]).length === 0}
							<p class="text-sm text-white/30">—</p>
						{:else}
							<ul class="space-y-1">
								{#each data.primaryMuscles as muscle}
									<li class="text-sm">
										<a href="/anatomy" class="text-white/70 hover:text-sakura-300">{muscle.name_en}</a>
										<span class="ml-1 text-xs text-white/30">{muscle.name_zh}</span>
									</li>
								{/each}
							</ul>
						{/if}
					</div>

					<div class="panel-glass p-4">
						<h3 class="mb-2 text-xs font-medium uppercase tracking-wider text-white/30">Secondary Muscles</h3>
						{#if (data.secondaryMuscles as MuscleGroup[]).length === 0}
							<p class="text-sm text-white/30">—</p>
						{:else}
							<ul class="space-y-1">
								{#each data.secondaryMuscles as muscle}
									<li class="text-sm">
										<a href="/anatomy" class="text-white/70 hover:text-sakura-300">{muscle.name_en}</a>
										<span class="ml-1 text-xs text-white/30">{muscle.name_zh}</span>
									</li>
								{/each}
							</ul>
						{/if}
					</div>
				</div>
			</div>

			<!-- Muscle activation visualization -->
			<div class="panel-glass p-4">
				<p class="mb-2 text-center text-xs font-medium uppercase tracking-wider text-white/30">Muscle Activation</p>
				<CharacterViewer
					primaryMeshKeys={primaryKeys}
					secondaryMeshKeys={secondaryKeys}
					compact
				/>
			</div>
		</div>
	{/if}
</div>
