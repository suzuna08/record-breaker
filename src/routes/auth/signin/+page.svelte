<script lang="ts">
	import FormField from '$lib/components/ui/FormField.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import ErrorBanner from '$lib/components/ui/ErrorBanner.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let errorMsg = $state('');

	async function handleSignIn() {
		loading = true;
		errorMsg = '';

		const { error } = await data.supabase.auth.signInWithPassword({ email, password });

		if (error) {
			errorMsg = error.message;
			loading = false;
		} else {
			window.location.href = '/dashboard';
		}
	}
</script>

<svelte:head>
	<title>Sign In — Gym Anatomy Tracker</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
	<div class="w-full max-w-sm">
		<div class="mb-8 text-center">
			<h1 class="text-2xl font-bold text-zinc-50">Welcome Back</h1>
			<p class="mt-1 text-sm text-zinc-400">歡迎回來</p>
		</div>

		<form class="space-y-4" onsubmit={(e) => { e.preventDefault(); handleSignIn(); }}>
			<ErrorBanner visible={!!errorMsg} message={errorMsg} />

			<FormField label="Email" name="email" type="email" bind:value={email} placeholder="you@example.com" required />
			<FormField label="Password" name="password" type="password" bind:value={password} placeholder="••••••••" required />

			<Button type="submit" variant="primary" size="lg" disabled={loading}>
				{loading ? 'Signing in...' : 'Sign In'}
			</Button>
		</form>

		<p class="mt-6 text-center text-sm text-zinc-500">
			Don't have an account?
			<a href="/auth/signup" class="text-brand-400 hover:text-brand-300">Sign up</a>
		</p>
	</div>
</div>
