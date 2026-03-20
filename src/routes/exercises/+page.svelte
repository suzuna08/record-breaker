<script lang="ts">
	import ExerciseCard from '$lib/components/exercises/ExerciseCard.svelte';
	import type { Exercise, ExerciseMuscleMap, MuscleGroup } from '$lib/types';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let searchInput = $state(data.search || '');

	const muscleById = $derived(
		new Map((data.muscles as MuscleGroup[]).map((m) => [m.id, m]))
	);

	function getMuscleNames(exerciseId: string, role: 'primary' | 'secondary'): string[] {
		return (data.mappings as ExerciseMuscleMap[])
			.filter((m) => m.exercise_id === exerciseId && m.role === role)
			.map((m) => muscleById.get(m.muscle_id)?.name_en ?? '')
			.filter(Boolean);
	}

	function handleSearch() {
		const params = new URLSearchParams();
		if (searchInput) params.set('q', searchInput);
		if (data.muscleFilter) params.set('muscle', data.muscleFilter);
		goto(`/exercises?${params.toString()}`);
	}

	function handleMuscleFilter(muscleId: string) {
		const params = new URLSearchParams();
		if (searchInput) params.set('q', searchInput);
		if (muscleId && muscleId !== data.muscleFilter) {
			params.set('muscle', muscleId);
		}
		goto(`/exercises?${params.toString()}`);
	}

	const uniqueRegions = $derived(
		[...new Set((data.muscles as MuscleGroup[]).map((m) => m.region))].sort()
	);
</script>

<svelte:head>
	<title>Exercise Library — Gym Anatomy Tracker</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-8">
	<div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<h1 class="text-3xl font-bold text-zinc-50">Exercise Library</h1>
			<p class="mt-1 text-sm text-zinc-400">訓練動作庫 — Browse and search exercises</p>
		</div>
		<form onsubmit={(e) => { e.preventDefault(); handleSearch(); }} class="flex gap-2">
			<input
				type="text"
				bind:value={searchInput}
				placeholder="Search exercises..."
				class="rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
			/>
			<button type="submit" class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500">
				Search
			</button>
		</form>
	</div>

	<!-- Muscle group filter -->
	<div class="mb-6">
		<p class="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">Filter by Muscle</p>
		<div class="flex flex-wrap gap-2">
			<button
				class="rounded-full px-3 py-1 text-xs font-medium transition {!data.muscleFilter ? 'bg-brand-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}"
				onclick={() => handleMuscleFilter('')}
			>
				All
			</button>
			{#each uniqueRegions as region}
				<span class="text-xs text-zinc-600">|</span>
				{#each (data.muscles as MuscleGroup[]).filter((m) => m.region === region) as muscle}
					<button
						class="rounded-full px-3 py-1 text-xs font-medium transition {data.muscleFilter === muscle.id ? 'bg-brand-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}"
						onclick={() => handleMuscleFilter(muscle.id)}
					>
						{muscle.name_en}
					</button>
				{/each}
			{/each}
		</div>
	</div>

	<!-- Exercise list -->
	{#if (data.exercises as Exercise[]).length === 0}
		<div class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-12 text-center">
			<p class="text-zinc-500">No exercises found. Try a different search or filter.</p>
		</div>
	{:else}
		<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.exercises as exercise}
				<ExerciseCard
					{exercise}
					primaryMuscles={getMuscleNames(exercise.id, 'primary')}
					secondaryMuscles={getMuscleNames(exercise.id, 'secondary')}
					onclick={() => goto(`/exercises/${exercise.id}`)}
				/>
			{/each}
		</div>
		<p class="mt-4 text-sm text-zinc-600">{(data.exercises as Exercise[]).length} exercises</p>
	{/if}
</div>
