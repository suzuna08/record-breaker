<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import AnatomySvg from '$lib/components/anatomy/AnatomySvg.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const allMeshKeys = $derived(
		(data.mappings ?? []).map((m: any) => m.muscle?.mesh_key).filter(Boolean)
	);

	function getMusclesForExercise(exerciseId: string) {
		return (data.mappings ?? [])
			.filter((m: any) => m.exercise_id === exerciseId)
			.map((m: any) => m.muscle);
	}
</script>

<svelte:head>
	<title>{data.session?.title || 'Workout'} — Gym Anatomy Tracker</title>
</svelte:head>

<div class="mx-auto max-w-5xl px-4 py-8">
	{#if !data.session}
		<p class="text-zinc-500">Workout not found.</p>
	{:else}
		<div class="mb-6">
			<Button href="/workouts" variant="ghost" size="sm">← Back to Workouts</Button>
		</div>

		<div class="grid gap-8 lg:grid-cols-[1fr_260px]">
			<div>
				<h1 class="text-3xl font-bold text-zinc-50">{data.session.title || 'Untitled Workout'}</h1>
				<p class="mt-1 text-sm text-zinc-400">
					{new Date(data.session.session_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
				</p>
				{#if data.session.note}
					<p class="mt-2 text-sm text-zinc-400">{data.session.note}</p>
				{/if}

				<div class="mt-6 space-y-3">
					{#each data.session.exercise_logs ?? [] as log}
						<div class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
							<div class="flex items-start justify-between">
								<div>
									<h3 class="font-semibold text-zinc-100">{log.exercise?.name_en ?? 'Exercise'}</h3>
									<p class="text-sm text-zinc-400">{log.exercise?.name_zh ?? ''}</p>
								</div>
								<div class="text-right">
									<p class="text-sm font-medium text-zinc-200">{log.sets} × {log.reps}</p>
									<p class="text-xs text-zinc-400">{log.weight} kg</p>
								</div>
							</div>

							{#if log.rpe}
								<span class="mt-2 inline-block rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">RPE {log.rpe}</span>
							{/if}

							{#if getMusclesForExercise(log.exercise_id).length > 0}
								<div class="mt-2 flex flex-wrap gap-1">
									{#each getMusclesForExercise(log.exercise_id) as m}
										<span class="rounded-full bg-brand-600/15 px-2 py-0.5 text-xs text-brand-300">{m?.name_en}</span>
									{/each}
								</div>
							{/if}

							{#if log.note}
								<p class="mt-2 text-sm text-zinc-500">{log.note}</p>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<div class="hidden lg:block">
				<div class="sticky top-20 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
					<p class="mb-3 text-center text-xs font-medium uppercase tracking-wider text-zinc-500">Muscles Worked</p>
					<AnatomySvg highlightedMeshKeys={allMeshKeys} />
				</div>
			</div>
		</div>
	{/if}
</div>
