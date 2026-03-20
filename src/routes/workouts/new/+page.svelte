<script lang="ts">
	import FormField from '$lib/components/ui/FormField.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import ErrorBanner from '$lib/components/ui/ErrorBanner.svelte';
	import AnatomySvg from '$lib/components/anatomy/AnatomySvg.svelte';
	import type { Exercise, ExerciseMuscleMap } from '$lib/types';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let title = $state('');
	let sessionDate = $state(new Date().toISOString().split('T')[0]);
	let note = $state('');
	let saving = $state(false);
	let errorMsg = $state('');

	interface LogEntry {
		exercise_id: string;
		sets: number;
		reps: number;
		weight: number;
		rpe: string;
		note: string;
	}

	let logs = $state<LogEntry[]>([
		{ exercise_id: '', sets: 3, reps: 10, weight: 0, rpe: '', note: '' }
	]);

	function addLog() {
		logs.push({ exercise_id: '', sets: 3, reps: 10, weight: 0, rpe: '', note: '' });
	}

	function removeLog(index: number) {
		logs.splice(index, 1);
	}

	function getMusclesForExercise(exerciseId: string) {
		return (data.mappings as any[])
			.filter((m) => m.exercise_id === exerciseId)
			.map((m) => m.muscle);
	}

	let allSelectedMeshKeys = $derived(
		logs
			.filter((l) => l.exercise_id)
			.flatMap((l) =>
				getMusclesForExercise(l.exercise_id).map((m: any) => m.mesh_key)
			)
			.filter(Boolean)
	);

	let currentLogMeshKeys = $state<string[]>([]);
	function handleExerciseChange(logIndex: number) {
		const eid = logs[logIndex].exercise_id;
		if (eid) {
			currentLogMeshKeys = getMusclesForExercise(eid).map((m: any) => m.mesh_key);
		} else {
			currentLogMeshKeys = [];
		}
	}

	async function handleSave() {
		saving = true;
		errorMsg = '';

		const validLogs = logs.filter((l) => l.exercise_id);
		if (validLogs.length === 0) {
			errorMsg = 'Add at least one exercise to your workout.';
			saving = false;
			return;
		}

		const { data: sessionData, error: sessionError } = await data.supabase
			.from('workout_sessions')
			.insert({
				user_id: data.user?.id,
				title: title || `Workout ${sessionDate}`,
				session_date: sessionDate,
				note: note || null
			})
			.select()
			.single();

		if (sessionError || !sessionData) {
			errorMsg = sessionError?.message ?? 'Failed to create session.';
			saving = false;
			return;
		}

		const logInserts = validLogs.map((l) => ({
			session_id: sessionData.id,
			exercise_id: l.exercise_id,
			sets: l.sets,
			reps: l.reps,
			weight: l.weight,
			rpe: l.rpe ? parseFloat(l.rpe) : null,
			note: l.note || null
		}));

		const { error: logError } = await data.supabase
			.from('exercise_logs')
			.insert(logInserts);

		if (logError) {
			errorMsg = logError.message;
			saving = false;
			return;
		}

		goto(`/workouts/${sessionData.id}`);
	}
</script>

<svelte:head>
	<title>New Workout — Gym Anatomy Tracker</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-8">
	<div class="mb-6">
		<Button href="/workouts" variant="ghost" size="sm">← Back</Button>
	</div>

	<h1 class="mb-2 text-3xl font-bold text-zinc-50">New Workout</h1>
	<p class="mb-8 text-sm text-zinc-400">新增訓練 — Log your exercises and see targeted muscles</p>

	<ErrorBanner visible={!!errorMsg} message={errorMsg} />

	<div class="mt-4 grid gap-8 lg:grid-cols-[1fr_260px]">
		<div class="space-y-6">
			<!-- Session info -->
			<div class="grid gap-4 sm:grid-cols-2">
				<FormField label="Workout Title" name="title" bind:value={title} placeholder="e.g. Push Day" />
				<FormField label="Date" name="date" type="date" bind:value={sessionDate} />
			</div>
			<FormField label="Session Note (optional)" name="note" type="textarea" bind:value={note} placeholder="How did it go?" />

			<!-- Exercise logs -->
			<div>
				<h2 class="mb-3 text-lg font-semibold text-zinc-200">Exercises</h2>
				<div class="space-y-4">
					{#each logs as log, i}
						<div class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
							<div class="mb-3 flex items-center justify-between">
								<span class="text-xs font-medium text-zinc-500">Exercise #{i + 1}</span>
								{#if logs.length > 1}
									<button
										class="text-xs text-red-400 hover:text-red-300"
										onclick={() => removeLog(i)}
									>
										Remove
									</button>
								{/if}
							</div>

							<div class="space-y-3">
								<div>
									<label class="mb-1.5 block text-sm font-medium text-zinc-300">Exercise</label>
									<select
										bind:value={log.exercise_id}
										onchange={() => handleExerciseChange(i)}
										class="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
									>
										<option value="">Select exercise...</option>
										{#each data.exercises as exercise}
											<option value={exercise.id}>{exercise.name_en} ({exercise.name_zh})</option>
										{/each}
									</select>
								</div>

								{#if log.exercise_id}
									{@const muscles = getMusclesForExercise(log.exercise_id)}
									{#if muscles.length > 0}
										<div class="flex flex-wrap gap-1">
											{#each muscles as m}
												<span class="rounded-full bg-brand-600/20 px-2 py-0.5 text-xs text-brand-300">
													{m.name_en}
												</span>
											{/each}
										</div>
									{/if}
								{/if}

								<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
									<div>
										<label class="mb-1 block text-xs text-zinc-400">Sets</label>
										<input type="number" bind:value={log.sets} min="1" class="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 focus:border-brand-500 focus:outline-none" />
									</div>
									<div>
										<label class="mb-1 block text-xs text-zinc-400">Reps</label>
										<input type="number" bind:value={log.reps} min="1" class="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 focus:border-brand-500 focus:outline-none" />
									</div>
									<div>
										<label class="mb-1 block text-xs text-zinc-400">Weight (kg)</label>
										<input type="number" bind:value={log.weight} min="0" step="0.5" class="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 focus:border-brand-500 focus:outline-none" />
									</div>
									<div>
										<label class="mb-1 block text-xs text-zinc-400">RPE</label>
										<input type="text" bind:value={log.rpe} placeholder="6-10" class="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 focus:border-brand-500 focus:outline-none" />
									</div>
								</div>

								<input
									type="text"
									bind:value={log.note}
									placeholder="Note (optional)"
									class="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-brand-500 focus:outline-none"
								/>
							</div>
						</div>
					{/each}
				</div>

				<div class="mt-4 flex gap-3">
					<Button variant="secondary" onclick={addLog}>+ Add Exercise</Button>
					<Button variant="primary" onclick={handleSave} disabled={saving}>
						{saving ? 'Saving...' : 'Save Workout'}
					</Button>
				</div>
			</div>
		</div>

		<!-- Mini anatomy showing all muscles in this session -->
		<div class="hidden lg:block">
			<div class="sticky top-20 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
				<p class="mb-3 text-center text-xs font-medium uppercase tracking-wider text-zinc-500">Muscles Targeted</p>
				<AnatomySvg highlightedMeshKeys={allSelectedMeshKeys} />
				{#if allSelectedMeshKeys.length === 0}
					<p class="mt-2 text-center text-xs text-zinc-600">Select exercises to see muscles</p>
				{/if}
			</div>
		</div>
	</div>
</div>
