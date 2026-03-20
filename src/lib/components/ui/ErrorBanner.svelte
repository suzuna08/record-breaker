<script lang="ts">
	interface Props {
		visible: boolean;
		message?: string;
	}

	let { visible, message = '' }: Props = $props();
</script>

{#if visible}
	<div class="rounded-lg border border-red-800/50 bg-red-950/50 px-4 py-3 text-sm text-red-300">
		{message}
	</div>
{/if}
