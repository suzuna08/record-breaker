<script lang="ts">
	interface Props {
		visible: boolean;
		message?: string;
	}

	let { visible, message = '' }: Props = $props();
</script>

{#if visible}
	<div class="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300 backdrop-blur-sm">
		<span class="mr-1">⚠</span> {message}
	</div>
{/if}
