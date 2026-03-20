<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		value: string | number;
		subtitle?: string;
		icon?: Snippet;
	}

	let { title, value, subtitle, icon }: Props = $props();
</script>

<div class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-sm">
	<div class="flex items-start justify-between">
		<div>
			<p class="text-sm font-medium text-zinc-400">{title}</p>
			<p class="mt-1 text-2xl font-bold tracking-tight text-zinc-50">{value}</p>
			{#if subtitle}
				<p class="mt-0.5 text-xs text-zinc-500">{subtitle}</p>
			{/if}
		</div>
		{#if icon}
			<div class="rounded-lg bg-brand-600/20 p-2 text-brand-400">
				{@render icon()}
			</div>
		{/if}
	</div>
</div>
