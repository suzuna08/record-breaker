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
	<label for={name} class="mb-1.5 block text-sm font-medium text-zinc-300">{label}</label>
	{#if type === 'textarea'}
		<textarea
			id={name}
			{name}
			bind:value
			{placeholder}
			{required}
			{disabled}
			rows="3"
			class="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none disabled:opacity-50"
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
			class="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none disabled:opacity-50"
		/>
	{/if}
</div>
