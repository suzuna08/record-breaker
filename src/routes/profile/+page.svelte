<script lang="ts">
	import FormField from '$lib/components/ui/FormField.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import ErrorBanner from '$lib/components/ui/ErrorBanner.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let displayName = $state(data.profile?.display_name ?? '');
	let role = $state<'trainee' | 'coach'>((data.profile?.role as 'trainee' | 'coach') ?? 'trainee');
	let saving = $state(false);
	let errorMsg = $state('');
	let successMsg = $state('');

	async function handleSave() {
		saving = true;
		errorMsg = '';
		successMsg = '';

		const { error } = await data.supabase
			.from('profiles')
			.update({ display_name: displayName, role })
			.eq('id', data.user?.id);

		if (error) {
			errorMsg = error.message;
		} else {
			successMsg = 'Profile updated! 個人資料已更新。';
		}
		saving = false;
	}
</script>

<svelte:head>
	<title>Profile — Gym Anatomy Tracker</title>
</svelte:head>

<div class="mx-auto max-w-lg px-4 py-8">
	<h1 class="mb-2 text-3xl font-bold text-zinc-50">Profile</h1>
	<p class="mb-8 text-sm text-zinc-400">個人設定</p>

	<Card>
		<div class="space-y-4">
			<ErrorBanner visible={!!errorMsg} message={errorMsg} />

			{#if successMsg}
				<div class="rounded-lg border border-green-800/50 bg-green-950/50 px-4 py-3 text-sm text-green-300">
					{successMsg}
				</div>
			{/if}

			<div>
				<label class="mb-1.5 block text-sm font-medium text-zinc-400">Email</label>
				<p class="text-sm text-zinc-300">{data.profile?.email ?? '—'}</p>
			</div>

			<FormField label="Display Name" name="displayName" bind:value={displayName} placeholder="Your name" />

			<div>
				<label class="mb-1.5 block text-sm font-medium text-zinc-300">Role</label>
				<div class="grid grid-cols-2 gap-2">
					<button
						type="button"
						class="rounded-lg border px-3 py-2 text-sm transition {role === 'trainee' ? 'border-brand-500 bg-brand-600/20 text-brand-300' : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600'}"
						onclick={() => role = 'trainee'}
					>
						🏋️ Trainee
					</button>
					<button
						type="button"
						class="rounded-lg border px-3 py-2 text-sm transition {role === 'coach' ? 'border-brand-500 bg-brand-600/20 text-brand-300' : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600'}"
						onclick={() => role = 'coach'}
					>
						🎯 Coach
					</button>
				</div>
			</div>

			<Button variant="primary" onclick={handleSave} disabled={saving}>
				{saving ? 'Saving...' : 'Save Changes'}
			</Button>
		</div>
	</Card>

	<Card class="mt-6">
		<h2 class="mb-3 text-lg font-semibold text-zinc-200">Coach / Student Links</h2>
		<p class="text-sm text-zinc-500">Coach-student relationship management will be available in a future update.</p>
		<p class="text-xs text-zinc-600">教練與學員關係管理將在未來版本提供。</p>
	</Card>
</div>
