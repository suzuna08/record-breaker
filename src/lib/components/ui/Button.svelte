<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
		size?: 'sm' | 'md' | 'lg';
		href?: string;
		disabled?: boolean;
		type?: 'button' | 'submit';
		onclick?: () => void;
		children: Snippet;
	}

	let { variant = 'primary', size = 'md', href, disabled = false, type = 'button', onclick, children }: Props = $props();

	const baseClass = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed';

	const variants: Record<string, string> = {
		primary: 'bg-brand-600 text-white hover:bg-brand-500 focus:ring-brand-500',
		secondary: 'bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700 focus:ring-zinc-500',
		ghost: 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 focus:ring-zinc-500',
		danger: 'bg-red-600 text-white hover:bg-red-500 focus:ring-red-500',
	};

	const sizes: Record<string, string> = {
		sm: 'px-3 py-1.5 text-xs gap-1.5',
		md: 'px-4 py-2 text-sm gap-2',
		lg: 'px-6 py-2.5 text-base gap-2',
	};

	let classes = $derived(`${baseClass} ${variants[variant]} ${sizes[size]}`);
</script>

{#if href}
	<a {href} class={classes}>
		{@render children()}
	</a>
{:else}
	<button {type} {disabled} {onclick} class={classes}>
		{@render children()}
	</button>
{/if}
