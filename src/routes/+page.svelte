<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Record Breaker</title>
</svelte:head>

{#if data.session}
	<div class="mx-auto max-w-7xl px-4 py-12 text-center">
		<p class="text-white/40">Redirecting to dashboard...</p>
	</div>
	<script>
		window.location.href = '/dashboard';
	</script>
{:else}
	<div class="relative">
		<div class="mx-auto max-w-5xl px-4 py-24 text-center">
			<div class="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/60 backdrop-blur-sm">
				<span class="h-2 w-2 rounded-full bg-sakura-400 shadow-[0_0_6px_var(--color-sakura-400)]"></span>
				Interactive 3D Muscle Anatomy
			</div>

			<h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
				Break Your Records.<br />
				<span class="bg-gradient-to-r from-sakura-300 to-sakura-500 bg-clip-text text-transparent">Every Rep Counts.</span>
			</h1>

			<p class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
				Explore muscle groups in 3D, log every set, track progress photos, and learn the anatomy behind every lift.
				Built for lifters and coaches who care about the details.
			</p>
			<p class="mx-auto mt-2 max-w-2xl text-base text-white/40">
				探索3D肌肉解剖圖，記錄每一組訓練，追蹤進度照片。為重視細節的健身者和教練打造。
			</p>

			<div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
				<a href="/auth/signup" class="btn-game btn-game-primary">
					Get Started Free
				</a>
				<a href="/anatomy" class="btn-game btn-game-secondary">
					Explore Anatomy
				</a>
			</div>

			<div class="mt-20 grid gap-6 sm:grid-cols-3">
				{#each [
					{ icon: '◉', title: '3D Anatomy Explorer', titleZh: '3D解剖探索', desc: 'Interactive muscle map with English & Chinese labels. Click any muscle to see related exercises.' },
					{ icon: '📋', title: 'Workout Logging', titleZh: '訓練記錄', desc: 'Log sets, reps, weight, and RPE. See which muscles each exercise targets in real time.' },
					{ icon: '📷', title: 'Progress Photos', titleZh: '進度照片', desc: 'Upload and organize your transformation photos with a visual timeline.' },
				] as feature}
					<div class="panel-glass p-6 text-left">
						<div class="mb-3 text-2xl drop-shadow-[0_0_6px_var(--color-sakura-400)]">{feature.icon}</div>
						<h3 class="font-semibold text-white">{feature.title}</h3>
						<p class="text-xs text-sakura-300/60">{feature.titleZh}</p>
						<p class="mt-2 text-sm leading-relaxed text-white/50">{feature.desc}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
