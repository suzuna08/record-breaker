<script lang="ts">
	import AnatomySvg from '$lib/components/anatomy/AnatomySvg.svelte';
	import MuscleInfoPanel from '$lib/components/anatomy/MuscleInfoPanel.svelte';
	import { ANATOMY_REGIONS, type AnatomyRegion } from '$lib/data/anatomy';
	import type { Exercise, ExerciseMuscleMap, MuscleGroup } from '$lib/types';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let selectedRegion = $state<AnatomyRegion | null>(null);
	let viewMode = $state<'front' | 'back'>('front');

	const muscleByMeshKey = $derived(
		new Map((data.muscles as MuscleGroup[]).map((m) => [m.mesh_key, m]))
	);

	const exerciseById = $derived(
		new Map((data.exercises as Exercise[]).map((e) => [e.id, e]))
	);

	function getExercisesForMeshKey(meshKey: string): Exercise[] {
		const muscle = muscleByMeshKey.get(meshKey);
		if (!muscle) return [];
		return (data.mappings as ExerciseMuscleMap[])
			.filter((m) => m.muscle_id === muscle.id)
			.map((m) => exerciseById.get(m.exercise_id))
			.filter((e): e is Exercise => !!e);
	}

	let relatedExercises = $derived(
		selectedRegion ? getExercisesForMeshKey(selectedRegion.mesh_key) : []
	);

	function handleSelect(region: AnatomyRegion) {
		selectedRegion = selectedRegion?.mesh_key === region.mesh_key ? null : region;
	}

	function handleExerciseClick(exercise: Exercise) {
		window.location.href = `/exercises/${exercise.id}`;
	}

	const regionFilters = ['all', 'chest', 'shoulders', 'back', 'arms', 'core', 'legs'] as const;
	let activeFilter = $state<string>('all');

	let filteredRegions = $derived(
		activeFilter === 'all'
			? ANATOMY_REGIONS
			: ANATOMY_REGIONS.filter((r) => r.region === activeFilter)
	);
</script>

<svelte:head>
	<title>Anatomy Explorer — Gym Anatomy Tracker</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-8">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-zinc-50">Anatomy Explorer</h1>
		<p class="mt-1 text-sm text-zinc-400">解剖探索 — Click any muscle to learn more and find related exercises</p>
	</div>

	<!-- Region filter pills -->
	<div class="mb-6 flex flex-wrap gap-2">
		{#each regionFilters as filter}
			<button
				class="rounded-full px-3 py-1 text-xs font-medium capitalize transition {activeFilter === filter ? 'bg-brand-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}"
				onclick={() => activeFilter = filter}
			>
				{filter}
			</button>
		{/each}
	</div>

	<div class="grid gap-8 lg:grid-cols-[1fr_380px]">
		<!-- Left: Anatomy Model -->
		<div class="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
			<div class="mb-4 flex items-center justify-between">
				<p class="text-xs font-medium uppercase tracking-wider text-zinc-500">Interactive Model</p>
				<div class="flex gap-1">
					<button
						class="rounded-md px-2.5 py-1 text-xs transition {viewMode === 'front' ? 'bg-zinc-700 text-zinc-200' : 'text-zinc-500 hover:text-zinc-300'}"
						onclick={() => viewMode = 'front'}
					>
						Front
					</button>
					<button
						class="rounded-md px-2.5 py-1 text-xs transition {viewMode === 'back' ? 'bg-zinc-700 text-zinc-200' : 'text-zinc-500 hover:text-zinc-300'}"
						onclick={() => viewMode = 'back'}
					>
						Back
					</button>
				</div>
			</div>

			<AnatomySvg
				selectedMeshKey={selectedRegion?.mesh_key}
				highlightedMeshKeys={filteredRegions.map((r) => r.mesh_key)}
				onSelect={handleSelect}
			/>

			<p class="mt-4 text-center text-xs text-zinc-600">
				Placeholder SVG model — replace with GLB/GLTF asset via Threlte for full 3D interaction
			</p>
		</div>

		<!-- Right: Info Panel -->
		<div class="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
			<MuscleInfoPanel
				region={selectedRegion}
				exercises={relatedExercises}
				onExerciseClick={handleExerciseClick}
			/>
		</div>
	</div>

	<!-- Muscle group grid (quick select) -->
	<div class="mt-8">
		<h2 class="mb-4 text-lg font-semibold text-zinc-200">All Muscle Groups</h2>
		<div class="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{#each filteredRegions as region}
				<button
					class="rounded-xl border p-4 text-left transition {selectedRegion?.mesh_key === region.mesh_key
						? 'border-brand-500 bg-brand-600/10'
						: 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'}"
					onclick={() => handleSelect(region)}
				>
					<p class="font-medium text-zinc-200">{region.name_en}</p>
					<p class="text-sm text-zinc-400">{region.name_zh}</p>
					<p class="mt-1 text-xs capitalize text-zinc-500">{region.region}</p>
				</button>
			{/each}
		</div>
	</div>
</div>
