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

	const baseClass = 'inline-flex items-center justify-center font-bold rounded-full transition-all duration-200 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed';

	const variants: Record<string, string> = {
		primary: 'btn-game-primary',
		secondary: 'btn-game-secondary',
		ghost: 'btn-game-ghost',
		danger: 'bg-gradient-to-b from-red-500 to-red-600 text-white border-2 border-red-400/30 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:-translate-y-0.5',
	};

	const sizes: Record<string, string> = {
		sm: 'px-3.5 py-1.5 text-xs gap-1.5',
		md: 'px-5 py-2 text-sm gap-2',
		lg: 'px-7 py-3 text-base gap-2',
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
