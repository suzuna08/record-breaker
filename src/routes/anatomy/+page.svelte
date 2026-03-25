<script lang="ts">
	import CharacterViewer from '$lib/components/anatomy/CharacterViewer.svelte';
	import MuscleInfoPanel from '$lib/components/anatomy/MuscleInfoPanel.svelte';
	import { ANATOMY_REGIONS, type AnatomyRegion } from '$lib/data/anatomy';
	import type { Exercise, ExerciseMuscleMap, MuscleGroup } from '$lib/types';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let selectedRegion = $state<AnatomyRegion | null>(null);

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

	function handleMuscleClick(meshKey: string) {
		const region = ANATOMY_REGIONS.find((r) => r.mesh_key === meshKey);
		if (!region) return;
		selectedRegion = selectedRegion?.mesh_key === region.mesh_key ? null : region;
	}

	function handleRegionSelect(region: AnatomyRegion) {
		selectedRegion = selectedRegion?.mesh_key === region.mesh_key ? null : region;
	}

	function handleExerciseClick(exercise: Exercise) {
		window.location.href = `/exercises/${exercise.id}`;
	}

	const regionFilters = ['all', 'chest', 'shoulders', 'back', 'arms', 'core', 'legs'] as const;
	let activeFilter = $state<string>('all');

	const filteredRegions = $derived(
		activeFilter === 'all'
			? ANATOMY_REGIONS
			: ANATOMY_REGIONS.filter((r) => r.region === activeFilter)
	);

	const highlightedKeys = $derived(filteredRegions.map((r) => r.mesh_key));
</script>

<svelte:head>
	<title>Anatomy Explorer — Record Breaker</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-8">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-white">Anatomy Explorer</h1>
		<p class="mt-1 text-sm text-white/40">解剖探索 — Click any muscle to learn more and find related exercises</p>
	</div>

	<!-- Region filter pills -->
	<div class="mb-6 flex flex-wrap gap-2">
		{#each regionFilters as filter}
			<button
				class="rounded-full border px-3 py-1 text-xs font-medium capitalize transition {activeFilter === filter
					? 'border-sakura-500/30 bg-sakura-500/20 text-sakura-300 shadow-[0_0_8px_var(--color-sakura-500)/0.15]'
					: 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70'}"
				onclick={() => activeFilter = filter}
			>
				{filter}
			</button>
		{/each}
	</div>

	<div class="grid gap-8 lg:grid-cols-[1fr_380px]">
		<!-- Left: 3D Anatomy Model -->
		<div class="panel-glass p-6">
			<p class="mb-4 text-xs font-medium uppercase tracking-wider text-white/40">Interactive 3D Muscle Map</p>

			<CharacterViewer
				selectedMeshKey={selectedRegion?.mesh_key}
				highlightedMeshKeys={highlightedKeys}
				onMuscleClick={handleMuscleClick}
			/>
		</div>

		<!-- Right: Info Panel -->
		<div class="panel-glass p-6">
			<MuscleInfoPanel
				region={selectedRegion}
				exercises={relatedExercises}
				onExerciseClick={handleExerciseClick}
			/>
		</div>
	</div>

	<!-- Muscle group grid (quick select) -->
	<div class="mt-8">
		<h2 class="mb-4 text-lg font-semibold text-white/80">All Muscle Groups</h2>
		<div class="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{#each filteredRegions as region}
				<button
					class="rounded-xl border p-4 text-left transition {selectedRegion?.mesh_key === region.mesh_key
						? 'border-sakura-500/40 bg-sakura-500/15 shadow-[0_0_12px_var(--color-sakura-500)/0.1]'
						: 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'}"
					onclick={() => handleRegionSelect(region)}
				>
					<p class="font-medium text-white">{region.name_en}</p>
					<p class="text-sm text-white/50">{region.name_zh}</p>
					<p class="mt-1 text-xs capitalize text-white/30">{region.region}</p>
				</button>
			{/each}
		</div>
	</div>
</div>
