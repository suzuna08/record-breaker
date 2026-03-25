<script lang="ts">
	import { page } from '$app/stores';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import GameBackground from '$lib/components/ui/GameBackground.svelte';
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
		{ href: '/dashboard', label: 'Dashboard', labelZh: '儀表板', icon: '🏠' },
		{ href: '/anatomy', label: 'Anatomy', labelZh: '解剖', icon: '💪' },
		{ href: '/exercises', label: 'Exercises', labelZh: '動作庫', icon: '⚡' },
		{ href: '/workouts', label: 'Workouts', labelZh: '訓練', icon: '📋' },
		{ href: '/photos', label: 'Photos', labelZh: '照片', icon: '📸' },
	];

	let currentPath = $derived($page.url.pathname);
</script>

<div class="relative flex min-h-screen flex-col">
	<GameBackground />

	<!-- Header -->
	<header class="sticky top-0 z-50 border-b border-white/5"
		style="background: linear-gradient(135deg, rgba(42, 31, 61, 0.85), rgba(26, 16, 37, 0.9)); backdrop-filter: blur(20px);">
		<div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
			<!-- Logo -->
			<a href={session ? '/dashboard' : '/'} class="flex items-center gap-2 group">
				<span class="text-xl">🌸</span>
				<span class="text-lg font-extrabold tracking-tight
					bg-gradient-to-r from-sakura-300 via-sakura-400 to-gold-400
					bg-clip-text text-transparent
					group-hover:from-sakura-200 group-hover:to-gold-300 transition-all">
					Record Breaker
				</span>
			</a>

			{#if session}
				<!-- Desktop nav -->
				<nav class="hidden items-center gap-1 md:flex">
					{#each navLinks as link}
						<a
							href={link.href}
							class="rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide transition-all duration-200
								{currentPath.startsWith(link.href)
									? 'bg-sakura-500/20 text-sakura-300 shadow-sm shadow-sakura-500/10 border border-sakura-400/20'
									: 'text-white/50 hover:text-white/80 hover:bg-white/5 border border-transparent'}"
						>
							<span class="mr-1">{link.icon}</span>
							{link.label}
						</a>
					{/each}
				</nav>

				<div class="flex items-center gap-3">
					<a href="/profile"
						class="hidden text-xs font-medium text-white/40 hover:text-white/70 transition md:block">
						Profile
					</a>
					<form method="post" action="/auth/signout">
						<button type="submit"
							class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium text-white/40 transition hover:border-white/20 hover:text-white/60">
							Sign out
						</button>
					</form>

					<!-- Mobile hamburger -->
					<button
						class="rounded-lg p-1.5 text-white/50 hover:bg-white/10 md:hidden"
						aria-label="Toggle menu"
						onclick={() => mobileMenuOpen = !mobileMenuOpen}
					>
						<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							{#if mobileMenuOpen}
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
							{:else}
								<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
							{/if}
						</svg>
					</button>
				</div>
			{:else}
				<div class="flex items-center gap-2">
					<a href="/auth/signin"
						class="rounded-full px-4 py-1.5 text-xs font-medium text-white/50 transition hover:text-white/80">
						Sign in
					</a>
					<a href="/auth/signup"
						class="btn-game btn-game-primary text-xs !px-5 !py-1.5">
						Sign up
					</a>
				</div>
			{/if}
		</div>

		<!-- Mobile menu -->
		{#if session && mobileMenuOpen}
			<nav class="border-t border-white/5 px-4 py-3 md:hidden"
				style="background: rgba(26, 16, 37, 0.95);">
				{#each navLinks as link}
					<a
						href={link.href}
						onclick={() => mobileMenuOpen = false}
						class="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition
							{currentPath.startsWith(link.href)
								? 'bg-sakura-500/15 text-sakura-300'
								: 'text-white/50 hover:bg-white/5 hover:text-white/80'}"
					>
						<span class="text-base">{link.icon}</span>
						<div>
							<span>{link.label}</span>
							<span class="ml-2 text-[10px] font-normal opacity-50">{link.labelZh}</span>
						</div>
					</a>
				{/each}
				<a href="/profile" onclick={() => mobileMenuOpen = false}
					class="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-white/40 hover:text-white/70">
					<span class="text-base">👤</span> Profile
				</a>
			</nav>
		{/if}
	</header>

	<!-- Main content -->
	<main class="relative z-10 flex-1">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="relative z-10 border-t border-white/5 py-6 text-center">
		<div class="flex items-center justify-center gap-2 text-xs font-medium text-white/20">
			<span>🌸</span>
			<span>&copy; {new Date().getFullYear()} Record Breaker</span>
			<span>🌸</span>
		</div>
	</footer>
</div>
