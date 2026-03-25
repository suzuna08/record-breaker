<script lang="ts">
	import FormField from '$lib/components/ui/FormField.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import ErrorBanner from '$lib/components/ui/ErrorBanner.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let email = $state('');
	let password = $state('');
	let displayName = $state('');
	let role = $state<'trainee' | 'coach'>('trainee');
	let loading = $state(false);
	let errorMsg = $state('');
	let successMsg = $state('');

	async function handleSignUp() {
		loading = true;
		errorMsg = '';
		successMsg = '';

		const { error } = await data.supabase.auth.signUp({
			email,
			password,
			options: {
				data: { display_name: displayName || email.split('@')[0], role }
			}
		});

		if (error) {
			errorMsg = error.message;
		} else {
			successMsg = 'Check your email for a confirmation link! 請查看你的信箱確認連結。';
		}
		loading = false;
	}
</script>

<svelte:head>
	<title>Sign Up — Record Breaker</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
	<div class="panel-glass w-full max-w-sm rounded-2xl p-8">
		<div class="mb-8 text-center">
			<h1 class="text-2xl font-bold text-white">Create Account</h1>
			<p class="mt-1 text-sm text-white/40">建立帳號</p>
		</div>

		{#if successMsg}
			<div class="rounded-lg border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
				{successMsg}
			</div>
		{:else}
			<form class="space-y-4" onsubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
				<ErrorBanner visible={!!errorMsg} message={errorMsg} />

				<FormField label="Display Name" name="displayName" bind:value={displayName} placeholder="Your name" />
				<FormField label="Email" name="email" type="email" bind:value={email} placeholder="you@example.com" required />
				<FormField label="Password" name="password" type="password" bind:value={password} placeholder="At least 6 characters" required />

				<div>
					<label class="mb-1.5 block text-sm font-medium text-white/30">I am a...</label>
					<div class="grid grid-cols-2 gap-2">
						<button
							type="button"
							class="rounded-lg border px-3 py-2 text-sm transition {role === 'trainee' ? 'border-sakura-400/20 bg-sakura-500/20 text-sakura-300' : 'border-white/8 bg-white/5 text-white/30 hover:border-white/15'}"
							onclick={() => role = 'trainee'}
						>
							🏋️ Trainee
						</button>
						<button
							type="button"
							class="rounded-lg border px-3 py-2 text-sm transition {role === 'coach' ? 'border-sakura-400/20 bg-sakura-500/20 text-sakura-300' : 'border-white/8 bg-white/5 text-white/30 hover:border-white/15'}"
							onclick={() => role = 'coach'}
						>
							🎯 Coach
						</button>
					</div>
				</div>

				<Button type="submit" variant="primary" size="lg" disabled={loading}>
					{loading ? 'Creating account...' : 'Sign Up'}
				</Button>
			</form>

			<p class="mt-6 text-center text-sm text-white/30">
				Already have an account?
				<a href="/auth/signin" class="text-sakura-400 hover:text-sakura-300">Sign in</a>
			</p>
		{/if}
	</div>
</div>
