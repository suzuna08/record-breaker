<script lang="ts">
	import { page } from '$app/stores';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import '../app.css';

	interface Props {
		data: import('./$types').LayoutData;
		children: Snippet;
	}

	let { data, children }: Props = $props();
	let { supabase, session } = $derived(data);
	let mobileMenuOpen = $state(false);

	onMount(() => {
		const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => subscription.unsubscribe();
	});

	const navLinks = [
		{ href: '/dashboard', label: 'Dashboard', icon: '◫' },
		{ href: '/anatomy', label: 'Anatomy', icon: '◉' },
		{ href: '/exercises', label: 'Exercises', icon: '⚡' },
		{ href: '/workouts', label: 'Workouts', icon: '📋' },
		{ href: '/photos', label: 'Photos', icon: '📷' },
	];

	let currentPath = $derived($page.url.pathname);
</script>

<div class="flex min-h-screen flex-col">
	<header class="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
		<div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
			<a href={session ? '/dashboard' : '/'} class="flex items-center gap-2">
				<span class="text-lg font-bold tracking-tight text-brand-400">💪 GymAnatomy</span>
			</a>

			{#if session}
				<nav class="hidden items-center gap-1 md:flex">
					{#each navLinks as link}
						<a
							href={link.href}
							class="rounded-lg px-3 py-1.5 text-sm font-medium transition {currentPath.startsWith(link.href) ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'}"
						>
							{link.label}
						</a>
					{/each}
				</nav>

				<div class="flex items-center gap-3">
					<a href="/profile" class="hidden text-sm text-zinc-400 hover:text-zinc-200 md:block">
						Profile
					</a>
					<form method="post" action="/auth/signout">
						<button type="submit" class="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200">
							Sign out
						</button>
					</form>

					<button
						class="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 md:hidden"
						onclick={() => mobileMenuOpen = !mobileMenuOpen}
					>
						<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>
				</div>
			{:else}
				<div class="flex items-center gap-2">
					<a href="/auth/signin" class="rounded-lg px-4 py-1.5 text-sm text-zinc-400 transition hover:text-zinc-200">Sign in</a>
					<a href="/auth/signup" class="rounded-lg bg-brand-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-brand-500">Sign up</a>
				</div>
			{/if}
		</div>

		{#if session && mobileMenuOpen}
			<nav class="border-t border-zinc-800 px-4 py-3 md:hidden">
				{#each navLinks as link}
					<a
						href={link.href}
						onclick={() => mobileMenuOpen = false}
						class="block rounded-lg px-3 py-2 text-sm font-medium transition {currentPath.startsWith(link.href) ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'}"
					>
						<span class="mr-2">{link.icon}</span>{link.label}
					</a>
				{/each}
				<a href="/profile" onclick={() => mobileMenuOpen = false} class="block rounded-lg px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200">Profile</a>
			</nav>
		{/if}
	</header>

	<main class="flex-1">
		{@render children()}
	</main>

	<footer class="border-t border-zinc-800/50 py-6 text-center text-xs text-zinc-600">
		&copy; {new Date().getFullYear()} Gym Anatomy Tracker
	</footer>
</div>
