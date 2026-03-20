<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Workouts — Gym Anatomy Tracker</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-8">
	<div class="mb-8 flex items-end justify-between">
		<div>
			<h1 class="text-3xl font-bold text-zinc-50">Workout History</h1>
			<p class="mt-1 text-sm text-zinc-400">訓練紀錄</p>
		</div>
		<Button href="/workouts/new" variant="primary">+ New Workout</Button>
	</div>

	{#if data.sessions.length === 0}
		<Card>
			<div class="py-8 text-center">
				<p class="text-4xl opacity-20">📋</p>
				<p class="mt-3 text-zinc-500">No workouts yet. Start your first session!</p>
				<p class="text-sm text-zinc-600">還沒有訓練記錄，開始你的第一次訓練吧！</p>
				<div class="mt-4">
					<Button href="/workouts/new" variant="secondary">Create Workout</Button>
				</div>
			</div>
		</Card>
	{:else}
		<div class="space-y-3">
			{#each data.sessions as session}
				<a
					href="/workouts/{session.id}"
					class="block rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-zinc-700 hover:bg-zinc-800/60"
				>
					<div class="flex items-start justify-between">
						<div>
							<h3 class="font-semibold text-zinc-100">{session.title || 'Untitled Workout'}</h3>
							<p class="mt-0.5 text-sm text-zinc-400">
								{new Date(session.session_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
							</p>
						</div>
						<span class="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400">
							{session.exercise_logs?.length ?? 0} exercises
						</span>
					</div>
					{#if session.exercise_logs && session.exercise_logs.length > 0}
						<div class="mt-3 flex flex-wrap gap-1.5">
							{#each session.exercise_logs.slice(0, 5) as log}
								<span class="rounded-full bg-zinc-800/60 px-2 py-0.5 text-xs text-zinc-500">
									{log.exercise?.name_en ?? 'Exercise'}
								</span>
							{/each}
							{#if session.exercise_logs.length > 5}
								<span class="text-xs text-zinc-600">+{session.exercise_logs.length - 5} more</span>
							{/if}
						</div>
					{/if}
					{#if session.note}
						<p class="mt-2 text-sm text-zinc-500">{session.note}</p>
					{/if}
				</a>
			{/each}
		</div>
	{/if}
</div>
