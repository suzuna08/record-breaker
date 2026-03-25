<script lang="ts">
	interface Props {
		label: string;
		name: string;
		type?: string;
		value?: string;
		placeholder?: string;
		required?: boolean;
		disabled?: boolean;
	}

	let { label, name, type = 'text', value = $bindable(''), placeholder = '', required = false, disabled = false }: Props = $props();
</script>

<div>
	<label for={name} class="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/40">{label}</label>
	{#if type === 'textarea'}
		<textarea
			id={name}
			{name}
			bind:value
			{placeholder}
			{required}
			{disabled}
			rows="3"
			class="w-full rounded-xl border-[1.5px] border-white/10 bg-game-900/40 px-4 py-2.5 text-sm text-white/90 placeholder-white/25 transition
				focus:border-sakura-400/40 focus:ring-2 focus:ring-sakura-500/15 focus:outline-none disabled:opacity-40"
		></textarea>
	{:else}
		<input
			id={name}
			{name}
			{type}
			bind:value
			{placeholder}
			{required}
			{disabled}
			class="w-full rounded-xl border-[1.5px] border-white/10 bg-game-900/40 px-4 py-2.5 text-sm text-white/90 placeholder-white/25 transition
				focus:border-sakura-400/40 focus:ring-2 focus:ring-sakura-500/15 focus:outline-none disabled:opacity-40"
		/>
	{/if}
</div>
