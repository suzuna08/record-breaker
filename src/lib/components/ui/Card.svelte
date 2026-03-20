<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		class?: string;
	}

	let { children, class: className = '' }: Props = $props();
</script>

<div class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-sm {className}">
	{@render children()}
</div>
