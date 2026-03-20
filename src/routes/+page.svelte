<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Gym Anatomy Tracker</title>
</svelte:head>

{#if data.session}
	<div class="mx-auto max-w-7xl px-4 py-12 text-center">
		<p class="text-zinc-400">Redirecting to dashboard...</p>
	</div>
	<script>
		window.location.href = '/dashboard';
	</script>
{:else}
	<div class="relative">
		<div class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-950/40 via-zinc-950 to-zinc-950"></div>

		<div class="mx-auto max-w-5xl px-4 py-24 text-center">
			<div class="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-1.5 text-sm text-zinc-400">
				<span class="h-2 w-2 rounded-full bg-brand-500"></span>
				Interactive 3D Muscle Anatomy
			</div>

			<h1 class="text-4xl font-extrabold tracking-tight text-zinc-50 sm:text-6xl">
				Your Gym Diary.<br />
				<span class="text-brand-400">Anatomy First.</span>
			</h1>

			<p class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
				Explore muscle groups in 3D, log every set, track progress photos, and learn the anatomy behind every lift.
				Built for lifters and coaches who care about the details.
			</p>
			<p class="mx-auto mt-2 max-w-2xl text-base text-zinc-500">
				探索3D肌肉解剖圖，記錄每一組訓練，追蹤進度照片。為重視細節的健身者和教練打造。
			</p>

			<div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
				<a
					href="/auth/signup"
					class="rounded-xl bg-brand-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-brand-500"
				>
					Get Started Free
				</a>
				<a
					href="/anatomy"
					class="rounded-xl border border-zinc-700 px-8 py-3 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-zinc-100"
				>
					Explore Anatomy
				</a>
			</div>

			<div class="mt-20 grid gap-6 sm:grid-cols-3">
				{#each [
					{ icon: '◉', title: '3D Anatomy Explorer', titleZh: '3D解剖探索', desc: 'Interactive muscle map with English & Chinese labels. Click any muscle to see related exercises.' },
					{ icon: '📋', title: 'Workout Logging', titleZh: '訓練記錄', desc: 'Log sets, reps, weight, and RPE. See which muscles each exercise targets in real time.' },
					{ icon: '📷', title: 'Progress Photos', titleZh: '進度照片', desc: 'Upload and organize your transformation photos with a visual timeline.' },
				] as feature}
					<div class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-left">
						<div class="mb-3 text-2xl">{feature.icon}</div>
						<h3 class="font-semibold text-zinc-100">{feature.title}</h3>
						<p class="text-xs text-zinc-500">{feature.titleZh}</p>
						<p class="mt-2 text-sm leading-relaxed text-zinc-400">{feature.desc}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
