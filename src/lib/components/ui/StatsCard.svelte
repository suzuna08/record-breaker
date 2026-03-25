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

<div class="panel-glass p-5">
	<div class="flex items-start justify-between">
		<div>
			<p class="text-xs font-bold uppercase tracking-wider text-white/30">{title}</p>
			<p class="mt-1.5 text-2xl font-extrabold tracking-tight text-white"
				style="text-shadow: 0 0 20px rgba(255, 143, 179, 0.3);">
				{value}
			</p>
			{#if subtitle}
				<p class="mt-0.5 text-xs text-white/30">{subtitle}</p>
			{/if}
		</div>
		{#if icon}
			<div class="rounded-xl bg-sakura-500/10 p-2.5 text-sakura-400 border border-sakura-400/10">
				{@render icon()}
			</div>
		{/if}
	</div>
</div>
