<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import ErrorBanner from '$lib/components/ui/ErrorBanner.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let showUpload = $state(false);
	let uploading = $state(false);
	let errorMsg = $state('');
	let shotType = $state<'front' | 'back' | 'side' | 'custom'>('front');
	let takenAt = $state(new Date().toISOString().split('T')[0]);
	let note = $state('');
	let fileInput = $state<HTMLInputElement | null>(null);

	async function handleUpload() {
		if (!fileInput?.files?.[0]) {
			errorMsg = 'Please select a photo.';
			return;
		}

		uploading = true;
		errorMsg = '';

		const file = fileInput.files[0];
		const userId = data.user?.id;
		const ext = file.name.split('.').pop();
		const filePath = `${userId}/${Date.now()}.${ext}`;

		const { error: uploadError } = await data.supabase.storage
			.from('progress-photos')
			.upload(filePath, file);

		if (uploadError) {
			errorMsg = uploadError.message;
			uploading = false;
			return;
		}

		const { error: dbError } = await data.supabase
			.from('progress_photos')
			.insert({
				user_id: userId,
				image_path: filePath,
				shot_type: shotType,
				taken_at: takenAt,
				note: note || null
			});

		if (dbError) {
			errorMsg = dbError.message;
			uploading = false;
			return;
		}

		window.location.reload();
	}

	const shotTypes = ['front', 'back', 'side', 'custom'] as const;
</script>

<svelte:head>
	<title>Progress Photos — Gym Anatomy Tracker</title>
</svelte:head>

<div class="mx-auto max-w-5xl px-4 py-8">
	<div class="mb-8 flex items-end justify-between">
		<div>
			<h1 class="text-3xl font-bold text-zinc-50">Progress Photos</h1>
			<p class="mt-1 text-sm text-zinc-400">進度照片 — Track your transformation</p>
		</div>
		<Button variant="primary" onclick={() => showUpload = !showUpload}>
			{showUpload ? 'Cancel' : '+ Upload Photo'}
		</Button>
	</div>

	{#if showUpload}
		<Card class="mb-8">
			<h2 class="mb-4 text-lg font-semibold text-zinc-200">Upload Photo</h2>
			<ErrorBanner visible={!!errorMsg} message={errorMsg} />

			<div class="mt-4 space-y-4">
				<div>
					<label class="mb-1.5 block text-sm font-medium text-zinc-300">Photo</label>
					<input
						bind:this={fileInput}
						type="file"
						accept="image/*"
						class="w-full text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-brand-500"
					/>
				</div>

				<div class="grid gap-4 sm:grid-cols-2">
					<div>
						<label class="mb-1.5 block text-sm font-medium text-zinc-300">Shot Type</label>
						<div class="grid grid-cols-4 gap-2">
							{#each shotTypes as st}
								<button
									type="button"
									class="rounded-lg border px-2 py-1.5 text-xs capitalize transition {shotType === st ? 'border-brand-500 bg-brand-600/20 text-brand-300' : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600'}"
									onclick={() => shotType = st}
								>
									{st}
								</button>
							{/each}
						</div>
					</div>
					<div>
						<label class="mb-1.5 block text-sm font-medium text-zinc-300">Date Taken</label>
						<input
							type="date"
							bind:value={takenAt}
							class="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 focus:border-brand-500 focus:outline-none"
						/>
					</div>
				</div>

				<div>
					<label class="mb-1.5 block text-sm font-medium text-zinc-300">Note (optional)</label>
					<input
						type="text"
						bind:value={note}
						placeholder="e.g. Week 4, after cutting..."
						class="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-brand-500 focus:outline-none"
					/>
				</div>

				<Button variant="primary" onclick={handleUpload} disabled={uploading}>
					{uploading ? 'Uploading...' : 'Upload'}
				</Button>
			</div>
		</Card>
	{/if}

	<!-- Photo grid -->
	{#if data.photos.length === 0}
		<Card>
			<div class="py-12 text-center">
				<p class="text-4xl opacity-20">📷</p>
				<p class="mt-3 text-zinc-500">No progress photos yet. Upload your first one!</p>
				<p class="text-sm text-zinc-600">還沒有進度照片，上傳你的第一張吧！</p>
			</div>
		</Card>
	{:else}
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.photos as photo}
				<div class="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
					<div class="aspect-[3/4] bg-zinc-800">
						{#if photo.image_url}
							<img
								src={photo.image_url}
								alt="Progress photo - {photo.shot_type}"
								class="h-full w-full object-cover"
								loading="lazy"
							/>
						{:else}
							<div class="flex h-full items-center justify-center text-zinc-600">
								<span class="text-3xl">📷</span>
							</div>
						{/if}
					</div>
					<div class="p-3">
						<div class="flex items-center justify-between">
							<span class="rounded-full bg-zinc-800 px-2 py-0.5 text-xs capitalize text-zinc-400">{photo.shot_type}</span>
							<span class="text-xs text-zinc-500">
								{new Date(photo.taken_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
							</span>
						</div>
						{#if photo.note}
							<p class="mt-2 text-sm text-zinc-400">{photo.note}</p>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
