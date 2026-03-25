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
	<title>Exercise Library — Record Breaker</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-8">
	<div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<h1 class="text-3xl font-bold text-white">Exercise Library</h1>
			<p class="mt-1 text-sm text-white/40">訓練動作庫 — Browse and search exercises</p>
		</div>
		<form onsubmit={(e) => { e.preventDefault(); handleSearch(); }} class="flex gap-2">
			<input
				type="text"
				bind:value={searchInput}
				placeholder="Search exercises..."
				class="rounded-lg border border-white/10 bg-game-900/40 px-3 py-2 text-sm text-white placeholder-white/30 focus:border-sakura-400 focus:ring-1 focus:ring-sakura-400 focus:outline-none"
			/>
			<button type="submit" class="btn-game-primary rounded-lg px-4 py-2 text-sm font-medium">
				Search
			</button>
		</form>
	</div>

	<!-- Muscle group filter -->
	<div class="mb-6">
		<p class="mb-2 text-xs font-medium uppercase tracking-wider text-white/25">Filter by Muscle</p>
		<div class="flex flex-wrap gap-2">
			<button
				class="rounded-full px-3 py-1 text-xs font-medium transition {!data.muscleFilter ? 'bg-sakura-500/20 text-sakura-300' : 'bg-white/5 text-white/30 hover:bg-white/10'}"
				onclick={() => handleMuscleFilter('')}
			>
				All
			</button>
			{#each uniqueRegions as region}
				<span class="text-xs text-white/15">|</span>
				{#each (data.muscles as MuscleGroup[]).filter((m) => m.region === region) as muscle}
					<button
						class="rounded-full px-3 py-1 text-xs font-medium transition {data.muscleFilter === muscle.id ? 'bg-sakura-500/20 text-sakura-300' : 'bg-white/5 text-white/30 hover:bg-white/10'}"
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
		<div class="panel-glass p-12 text-center">
			<p class="text-white/30">No exercises found. Try a different search or filter.</p>
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
		<p class="mt-4 text-sm text-white/25">{(data.exercises as Exercise[]).length} exercises</p>
	{/if}
</div>
