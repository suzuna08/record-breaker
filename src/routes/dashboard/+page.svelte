<script lang="ts">
	import StatsCard from '$lib/components/ui/StatsCard.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import AnatomySvg from '$lib/components/anatomy/AnatomySvg.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const recentMeshKeys = $derived(
		(data.recentMuscles ?? []).map((m: any) => m.mesh_key).filter(Boolean)
	);

	const totalSessions = $derived(data.recentSessions?.length ?? 0);
</script>

<svelte:head>
	<title>Dashboard — Gym Anatomy Tracker</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-8">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-zinc-50">
			Welcome back{data.profile?.display_name ? `, ${data.profile.display_name}` : ''}
		</h1>
		<p class="mt-1 text-sm text-zinc-400">歡迎回來 — Here's your training overview</p>
	</div>

	<!-- Stats row -->
	<div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<StatsCard title="This Week" value={data.weekCount} subtitle="workouts completed" />
		<StatsCard title="Recent Sessions" value={totalSessions} subtitle="last 5 logged" />
		<StatsCard title="Muscles Trained" value={recentMeshKeys.length} subtitle="in recent sessions" />
		<StatsCard title="Progress Photos" value={data.photoCount} subtitle="uploaded" />
	</div>

	<div class="grid gap-8 lg:grid-cols-[1fr_300px]">
		<div class="space-y-6">
			<!-- Quick actions -->
			<div class="flex flex-wrap gap-3">
				<Button href="/workouts/new" variant="primary">+ New Workout</Button>
				<Button href="/anatomy" variant="secondary">Explore Anatomy</Button>
				<Button href="/photos" variant="secondary">Upload Photo</Button>
			</div>

			<!-- Recent workouts -->
			<div>
				<h2 class="mb-3 text-lg font-semibold text-zinc-200">Recent Workouts</h2>
				{#if data.recentSessions.length === 0}
					<div class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-center">
						<p class="text-sm text-zinc-500">No workouts yet. Start training!</p>
					</div>
				{:else}
					<div class="space-y-2">
						{#each data.recentSessions as session}
							<a
								href="/workouts/{session.id}"
								class="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 transition hover:border-zinc-700"
							>
								<div>
									<p class="font-medium text-zinc-200">{session.title || 'Untitled'}</p>
									<p class="text-xs text-zinc-500">
										{new Date(session.session_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
										· {session.exercise_logs?.length ?? 0} exercises
									</p>
								</div>
								<span class="text-xs text-zinc-600">→</span>
							</a>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Chart placeholder -->
			<div class="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/20 p-8 text-center">
				<p class="text-sm text-zinc-500">Exercise progress chart coming soon</p>
				<p class="text-xs text-zinc-600">訓練進度圖表即將推出</p>
			</div>
		</div>

		<!-- Right sidebar: Recently trained muscles -->
		<div>
			<div class="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
				<h3 class="mb-3 text-sm font-medium uppercase tracking-wider text-zinc-500">Recently Trained</h3>
				<AnatomySvg highlightedMeshKeys={recentMeshKeys} />

				{#if (data.recentMuscles ?? []).length > 0}
					<div class="mt-4 flex flex-wrap gap-1.5">
						{#each data.recentMuscles ?? [] as muscle}
							<span class="rounded-full bg-brand-600/20 px-2 py-0.5 text-xs text-brand-300">
								{muscle.name_en}
							</span>
						{/each}
					</div>
				{:else}
					<p class="mt-3 text-center text-xs text-zinc-600">Log a workout to see trained muscles</p>
				{/if}
			</div>
		</div>
	</div>
</div>
