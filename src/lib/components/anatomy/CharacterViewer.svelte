<script lang="ts">
	import {
		FRONT_BODY_OUTLINE, FRONT_HEAD, FRONT_MUSCLES,
		FRONT_DEFINITION_LINES, FRONT_SHADOWS,
		BACK_BODY_OUTLINE, BACK_HEAD, BACK_MUSCLES,
		BACK_DEFINITION_LINES, BACK_SHADOWS,
		type MusclePath,
	} from '$lib/data/muscle-paths';
	import { REGION_COLORS } from '$lib/data/anatomy';
	import { getRegionForKey } from '$lib/data/mesh-key-map';
	import { getRegionStyle } from '$lib/data/muscle-regions';

	interface Props {
		primaryMeshKeys?: string[];
		secondaryMeshKeys?: string[];
		selectedMeshKey?: string | null;
		highlightedMeshKeys?: string[];
		onMuscleClick?: (meshKey: string) => void;
		view?: 'front' | 'back';
		compact?: boolean;
		showViewControls?: boolean;
	}

	let {
		primaryMeshKeys = [],
		secondaryMeshKeys = [],
		selectedMeshKey = null,
		highlightedMeshKeys = [],
		onMuscleClick,
		view = 'front',
		compact = false,
		showViewControls = true,
	}: Props = $props();

	let activeView = $state<'front' | 'back'>('front');
	let hoveredKey = $state<string | null>(null);
	let dragStartX = $state<number | null>(null);
	let rotateY = $state(0);

	$effect(() => { activeView = view; });

	const muscles = $derived(activeView === 'front' ? FRONT_MUSCLES : BACK_MUSCLES);
	const bodyOutline = $derived(activeView === 'front' ? FRONT_BODY_OUTLINE : BACK_BODY_OUTLINE);
	const headPath = $derived(activeView === 'front' ? FRONT_HEAD : BACK_HEAD);
	const defLines = $derived(activeView === 'front' ? FRONT_DEFINITION_LINES : BACK_DEFINITION_LINES);
	const shadows = $derived(activeView === 'front' ? FRONT_SHADOWS : BACK_SHADOWS);

	const hoveredRegion = $derived(hoveredKey ? getRegionForKey(hoveredKey) : null);

	const presets: { key: 'front' | 'back'; label: string; icon: string }[] = [
		{ key: 'front', label: 'Front', icon: '👤' },
		{ key: 'back', label: 'Back', icon: '🔙' },
	];

	function getMuscleOpacity(m: MusclePath): number {
		const isSel = m.mesh_key === selectedMeshKey;
		const isP = primaryMeshKeys.includes(m.mesh_key);
		const isS = secondaryMeshKeys.includes(m.mesh_key);
		const isH = highlightedMeshKeys.includes(m.mesh_key);
		const isHov = m.mesh_key === hoveredKey;
		if (isSel) return 0.7;
		if (isP) return isHov ? 0.65 : 0.5;
		if (isS) return isHov ? 0.45 : 0.3;
		if (isH) return isHov ? 0.35 : 0.15;
		if (isHov) return 0.3;
		return 0.0;
	}

	function getMuscleFilter(m: MusclePath): string {
		const base = REGION_COLORS[m.region] ?? '#ff6b95';
		const isSel = m.mesh_key === selectedMeshKey;
		const isP = primaryMeshKeys.includes(m.mesh_key);
		const isHov = m.mesh_key === hoveredKey;
		if (isSel) return `drop-shadow(0 0 6px ${base}) drop-shadow(0 0 14px ${base}88) drop-shadow(0 0 24px ${base}44)`;
		if (isP && isHov) return `drop-shadow(0 0 5px ${base}) drop-shadow(0 0 10px ${base}66)`;
		if (isP) return `drop-shadow(0 0 4px ${base}aa) drop-shadow(0 0 8px ${base}44)`;
		if (isHov) return `drop-shadow(0 0 3px ${base}88)`;
		return 'none';
	}

	function getMuscleStroke(m: MusclePath): string {
		const base = REGION_COLORS[m.region] ?? '#ff6b95';
		const isSel = m.mesh_key === selectedMeshKey;
		const isP = primaryMeshKeys.includes(m.mesh_key);
		const isHov = m.mesh_key === hoveredKey;
		if (isSel) return 'rgba(255,255,255,0.5)';
		if (isP) return isHov ? `${base}cc` : `${base}88`;
		if (isHov) return 'rgba(255,255,255,0.15)';
		return 'transparent';
	}

	function getDefLineOpacity(m: MusclePath): number {
		const isSel = m.mesh_key === selectedMeshKey;
		const isP = primaryMeshKeys.includes(m.mesh_key);
		if (isSel || isP) return 0.9;
		return 0.4;
	}

	function onPointerDown(e: PointerEvent) { dragStartX = e.clientX; }
	function onPointerMove(e: PointerEvent) {
		if (dragStartX === null) return;
		rotateY = Math.max(-15, Math.min(15, (e.clientX - dragStartX) * 0.3));
	}
	function onPointerUp() { dragStartX = null; rotateY = 0; }
</script>

<div
	class="relative mx-auto select-none"
	class:max-w-[260px]={compact}
	class:max-w-[520px]={!compact}
>
	{#if showViewControls}
		<div class="mb-3 flex justify-center gap-1 rounded-2xl p-1
			border border-white/5"
			style="background: linear-gradient(135deg, rgba(42, 31, 61, 0.85), rgba(26, 16, 37, 0.9)); backdrop-filter: blur(12px);">
			{#each presets as p}
				<button
					class="flex-1 rounded-xl px-4 py-2 text-xs font-bold tracking-wide transition-all duration-300
						{activeView === p.key
							? 'bg-sakura-500/20 text-sakura-300 shadow-sm shadow-sakura-500/10 border border-sakura-400/15'
							: 'text-white/30 hover:text-white/60 hover:bg-white/5 border border-transparent'}"
					onclick={() => activeView = p.key}
				>
					<span class="mr-1">{p.icon}</span>
					{p.label}
				</button>
			{/each}
		</div>
	{/if}

	<div
		class="relative overflow-hidden rounded-2xl border border-white/5"
		style="
			background: linear-gradient(180deg, rgba(42, 31, 61, 0.6) 0%, rgba(26, 16, 37, 0.8) 60%, rgba(40, 25, 45, 0.9) 100%);
			backdrop-filter: blur(8px);
			aspect-ratio: {compact ? '2/3' : '3/5'};
		"
		role="img"
		aria-label="Interactive muscle anatomy character"
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onpointerleave={onPointerUp}
	>
		<div class="pointer-events-none absolute inset-0 z-[1]">
			<div class="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-sakura-400/15 rounded-tl-2xl"></div>
			<div class="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-gold-400/15 rounded-tr-2xl"></div>
			<div class="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-sky-400/10 rounded-bl-2xl"></div>
			<div class="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-sakura-400/10 rounded-br-2xl"></div>
		</div>

		<div class="absolute bottom-0 left-0 right-0 h-[15%] z-[2]">
			<svg viewBox="0 0 200 40" preserveAspectRatio="xMidYMax slice" class="w-full h-full">
				<defs>
					<linearGradient id="podiumGrad" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stop-color="#6a5a7a" stop-opacity="0.7" />
						<stop offset="30%" stop-color="#5a4a6a" stop-opacity="0.8" />
						<stop offset="60%" stop-color="#3a2a4a" stop-opacity="0.9" />
						<stop offset="100%" stop-color="#2a1a3a" stop-opacity="1" />
					</linearGradient>
					<linearGradient id="podiumTop" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stop-color="#8a7a9a" stop-opacity="0.5" />
						<stop offset="40%" stop-color="#7a6a8a" stop-opacity="0.4" />
						<stop offset="100%" stop-color="#5a4a6a" stop-opacity="0.3" />
					</linearGradient>
					<linearGradient id="stoneTexture" x1="0" y1="0" x2="1" y2="1">
						<stop offset="0%" stop-color="#7a6a7a" stop-opacity="0.15" />
						<stop offset="25%" stop-color="#8a7a6a" stop-opacity="0.1" />
						<stop offset="50%" stop-color="#6a6a7a" stop-opacity="0.12" />
						<stop offset="75%" stop-color="#7a7068" stop-opacity="0.08" />
						<stop offset="100%" stop-color="#6a5a6a" stop-opacity="0.1" />
					</linearGradient>
				</defs>
				<ellipse cx="100" cy="10" rx="90" ry="9" fill="url(#podiumTop)" />
				<ellipse cx="100" cy="10" rx="90" ry="9" fill="url(#stoneTexture)" />
				<ellipse cx="100" cy="10" rx="90" ry="9" fill="none" stroke="rgba(200,170,230,0.15)" stroke-width="0.5" />
				<ellipse cx="100" cy="10" rx="88" ry="8" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="0.3" />
				<rect x="10" y="10" width="180" height="30" fill="url(#podiumGrad)" />
				<rect x="10" y="10" width="180" height="30" fill="url(#stoneTexture)" />
				<ellipse cx="100" cy="40" rx="90" ry="6" fill="#2a1a3a" />
				<ellipse cx="100" cy="40" rx="88" ry="5" fill="#1a1025" opacity="0.5" />
				<ellipse cx="100" cy="10" rx="72" ry="5.5" fill="none" stroke="rgba(126, 232, 250, 0.3)" stroke-width="0.7">
					<animate attributeName="stroke-opacity" values="0.15;0.4;0.15" dur="3s" repeatCount="indefinite" />
				</ellipse>
				<ellipse cx="100" cy="10" rx="68" ry="4" fill="none" stroke="rgba(126, 232, 250, 0.12)" stroke-width="1.5">
					<animate attributeName="stroke-opacity" values="0.08;0.2;0.08" dur="3s" begin="0.5s" repeatCount="indefinite" />
				</ellipse>
				<path d="M 85,10 L 80,0 C 88,-2 94,-1 85,10 Z" fill="rgba(126, 232, 250, 0.04)" />
				<path d="M 100,10 L 100,-4 C 106,-3 108,-1 100,10 Z" fill="rgba(126, 232, 250, 0.05)" />
				<path d="M 115,10 L 120,0 C 112,-2 106,-1 115,10 Z" fill="rgba(126, 232, 250, 0.04)" />
			</svg>
		</div>

		{#if selectedMeshKey}
			<div class="pointer-events-none absolute inset-0 z-[3]">
				{#each Array(6) as _, i}
					<div
						class="absolute w-1 h-1 rounded-full bg-white"
						style="
							left: {30 + Math.random() * 40}%;
							top: {20 + Math.random() * 50}%;
							animation: sakura-pulse {1.5 + Math.random() * 1.5}s {Math.random() * 2}s ease-in-out infinite;
							opacity: {0.2 + Math.random() * 0.4};
						"
					></div>
				{/each}
			</div>
		{/if}

		<div class="absolute inset-0 flex items-end justify-center pb-[15%] z-[2]"
			style="perspective: 800px;">
			<svg
				viewBox="0 0 200 400"
				class="h-[90%] w-auto transition-transform duration-200 ease-out cursor-grab active:cursor-grabbing"
				style="transform: rotateY({rotateY}deg);"
			>
				<defs>
					<linearGradient id="skinGrad" x1="0" y1="0" x2="0.3" y2="1">
						<stop offset="0%" stop-color="#fce4d6" />
						<stop offset="50%" stop-color="#f5cdb5" />
						<stop offset="100%" stop-color="#e8b89a" />
					</linearGradient>
					<linearGradient id="skinShadow" x1="0" y1="0" x2="0.2" y2="1">
						<stop offset="0%" stop-color="#e8b898" />
						<stop offset="100%" stop-color="#d4a080" />
					</linearGradient>
					<linearGradient id="hairGrad" x1="0.5" y1="0" x2="0.5" y2="1">
						<stop offset="0%" stop-color="#3a2050" />
						<stop offset="50%" stop-color="#5a3870" />
						<stop offset="100%" stop-color="#4a3060" />
					</linearGradient>
					<linearGradient id="hairHighlight" x1="0.5" y1="0" x2="0.5" y2="1">
						<stop offset="0%" stop-color="#7a5890" />
						<stop offset="100%" stop-color="#5a3870" />
					</linearGradient>
					<filter id="outlineGlow" x="-10%" y="-10%" width="120%" height="120%">
						<feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
						<feFlood flood-color="rgba(200,170,230,0.3)" result="color" />
						<feComposite in="color" in2="blur" operator="in" result="shadow" />
						<feMerge>
							<feMergeNode in="shadow" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
					<filter id="muscleGlow" x="-20%" y="-20%" width="140%" height="140%">
						<feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
						<feComposite in="SourceGraphic" in2="blur" operator="over" />
					</filter>
				</defs>

				<path
					d={bodyOutline}
					fill="url(#skinGrad)"
					stroke="rgba(160,120,100,0.6)"
					stroke-width="1.5"
					stroke-linejoin="round"
					filter="url(#outlineGlow)"
				/>

				{#each shadows as shadowPath}
					<path d={shadowPath} fill="#c8a088" fill-opacity="0.15" />
				{/each}

				<path d={headPath} fill="url(#skinGrad)" />

				{#if activeView === 'front'}
					<path d="M 78,20 C 80,8 90,0 100,0 C 110,0 120,8 122,20 L 120,30 C 118,38 112,42 100,44 C 88,42 82,38 80,30 Z" fill="url(#hairGrad)" />
					<ellipse cx="80" cy="28" rx="3" ry="5" fill="url(#skinGrad)" stroke="rgba(160,120,100,0.4)" stroke-width="0.5" />
					<ellipse cx="120" cy="28" rx="3" ry="5" fill="url(#skinGrad)" stroke="rgba(160,120,100,0.4)" stroke-width="0.5" />
					<path d="M 87,18 C 89,16 93,16 95,17" fill="none" stroke="#4a3060" stroke-width="1.5" stroke-linecap="round" />
					<path d="M 113,18 C 111,16 107,16 105,17" fill="none" stroke="#4a3060" stroke-width="1.5" stroke-linecap="round" />
					<ellipse cx="91" cy="24" rx="5" ry="5.5" fill="white" />
					<ellipse cx="109" cy="24" rx="5" ry="5.5" fill="white" />
					<ellipse cx="92" cy="24.5" rx="3.5" ry="4" fill="#4a6090" />
					<ellipse cx="110" cy="24.5" rx="3.5" ry="4" fill="#4a6090" />
					<ellipse cx="92.5" cy="25" rx="2" ry="2.5" fill="#1a1030" />
					<ellipse cx="110.5" cy="25" rx="2" ry="2.5" fill="#1a1030" />
					<ellipse cx="90" cy="22.5" rx="1.5" ry="1.8" fill="white" opacity="0.9" />
					<ellipse cx="108" cy="22.5" rx="1.5" ry="1.8" fill="white" opacity="0.9" />
					<ellipse cx="93" cy="26" rx="0.8" ry="1" fill="white" opacity="0.5" />
					<ellipse cx="111" cy="26" rx="0.8" ry="1" fill="white" opacity="0.5" />
					<path d="M 86,20 C 88,18.5 94,18 96,20" fill="none" stroke="#3a2050" stroke-width="0.8" stroke-linecap="round" />
					<path d="M 114,20 C 112,18.5 106,18 104,20" fill="none" stroke="#3a2050" stroke-width="0.8" stroke-linecap="round" />
					<path d="M 99,29 L 100,31 L 101,29" fill="none" stroke="#d4a080" stroke-width="0.6" stroke-linecap="round" />
					<path d="M 94,34 C 96,36.5 100,37.5 100,37.5 C 100,37.5 104,36.5 106,34" fill="none" stroke="#c88870" stroke-width="0.8" stroke-linecap="round" />
					<path d="M 95,34.5 C 97,36 100,36.5 100,36.5 C 100,36.5 103,36 105,34.5" fill="#c06060" fill-opacity="0.3" />
					<ellipse cx="83" cy="31" rx="5" ry="3" fill="#ff8fb3" opacity="0.25" />
					<ellipse cx="117" cy="31" rx="5" ry="3" fill="#ff8fb3" opacity="0.25" />
					<path d="M 78,16 C 80,6 90,0 100,0 C 110,0 120,6 122,16 L 120,22 C 118,14 110,6 100,6 C 90,6 82,14 80,22 Z" fill="url(#hairGrad)" />
					<path d="M 78,16 L 75,24 C 77,20 80,16 78,16 Z" fill="url(#hairGrad)" />
					<path d="M 122,16 L 125,24 C 123,20 120,16 122,16 Z" fill="url(#hairGrad)" />
					<path d="M 96,4 L 94,12 C 96,8 98,4 100,2 C 102,4 104,8 106,12 L 104,4 Z" fill="url(#hairGrad)" />
					<path d="M 90,6 C 94,4 98,3 100,3 C 102,3 106,4 110,6 L 108,10 C 104,8 100,7 100,7 C 100,7 96,8 92,10 Z" fill="#7a5890" opacity="0.4" />
				{:else}
					<path d={headPath} fill="#3a2050" />
					<path d="M 78,16 C 80,4 90,-2 100,-2 C 110,-2 120,4 122,16 L 120,30 C 118,40 112,46 100,48 C 88,46 82,40 80,30 Z" fill="url(#hairGrad)" />
					<path d="M 90,4 C 94,2 98,1 100,1 C 102,1 106,2 110,4 L 108,12 C 104,10 100,9 100,9 C 100,9 96,10 92,12 Z" fill="#7a5890" opacity="0.3" />
				{/if}

				{#each defLines as line}
					<path d={line} fill="none" stroke="rgba(180,140,110,0.3)" stroke-width="0.6" stroke-linecap="round" />
				{/each}

				<path d="M 70,152 L 66,180 C 70,186 82,188 90,186 L 94,168 L 98,186 L 100,186 L 102,186 L 106,168 L 110,186 C 118,188 130,186 134,180 L 130,152 C 122,158 110,160 100,160 C 90,160 78,158 70,152 Z" fill="#2a1f3d" stroke="#1a1025" stroke-width="1" />
				<path d="M 70,152 C 78,158 90,160 100,160 C 110,160 122,158 130,152" fill="none" stroke="rgba(200,170,230,0.25)" stroke-width="0.8" />
				<path d="M 68,170 L 72,172" fill="none" stroke="rgba(200,170,230,0.15)" stroke-width="0.5" />
				<path d="M 132,170 L 128,172" fill="none" stroke="rgba(200,170,230,0.15)" stroke-width="0.5" />

				<path d="M 46,384 C 48,380 52,378 58,378 L 62,378 C 64,380 64,386 62,390 L 50,390 C 46,390 44,388 46,384 Z" fill="#5a4a3a" stroke="#3a2a20" stroke-width="0.5" />
				<path d="M 50,382 L 58,380" fill="none" stroke="#7a6a5a" stroke-width="1" stroke-linecap="round" />
				<path d="M 154,384 C 152,380 148,378 142,378 L 138,378 C 136,380 136,386 138,390 L 150,390 C 154,390 156,388 154,384 Z" fill="#5a4a3a" stroke="#3a2a20" stroke-width="0.5" />
				<path d="M 150,382 L 142,380" fill="none" stroke="#7a6a5a" stroke-width="1" stroke-linecap="round" />

				{#each muscles as muscle}
					{@const col = REGION_COLORS[muscle.region] ?? '#ff6b95'}
					<g
						style="filter: {getMuscleFilter(muscle)}; cursor: pointer; transition: all 0.3s ease;"
						role="button"
						tabindex="0"
						onmouseenter={() => hoveredKey = muscle.mesh_key}
						onmouseleave={() => hoveredKey = null}
						onclick={() => onMuscleClick?.(muscle.mesh_key)}
						onkeydown={(e) => e.key === 'Enter' && onMuscleClick?.(muscle.mesh_key)}
					>
						{#each muscle.paths as path}
							<path
								d={path}
								fill={col}
								fill-opacity={getMuscleOpacity(muscle)}
								stroke={getMuscleStroke(muscle)}
								stroke-width="0.6"
								stroke-linejoin="round"
							/>
						{/each}
						{#if muscle.mirror}
							{#each muscle.mirror as path}
								<path
									d={path}
									fill={col}
									fill-opacity={getMuscleOpacity(muscle)}
									stroke={getMuscleStroke(muscle)}
									stroke-width="0.6"
									stroke-linejoin="round"
								/>
							{/each}
						{/if}
						{#if muscle.mesh_key === selectedMeshKey}
							<path d={muscle.paths[0]} fill="none" stroke={col} stroke-width="0.4" stroke-opacity="0.6" stroke-dasharray="2 3">
								<animate attributeName="stroke-dashoffset" values="0;10" dur="1.5s" repeatCount="indefinite" />
							</path>
							{#if muscle.mirror && muscle.mirror[0]}
								<path d={muscle.mirror[0]} fill="none" stroke={col} stroke-width="0.4" stroke-opacity="0.6" stroke-dasharray="2 3">
									<animate attributeName="stroke-dashoffset" values="0;10" dur="1.5s" repeatCount="indefinite" />
								</path>
							{/if}
						{/if}
					</g>
				{/each}
			</svg>
		</div>

		{#if hoveredRegion}
			{@const style = getRegionStyle(hoveredRegion.mesh_key)}
			<div class="pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2
				rounded-xl border border-white/10 bg-game-900/90 backdrop-blur-lg
				px-4 py-2 text-center shadow-2xl shadow-black/30
				transition-all duration-150">
				<p class="text-sm font-extrabold text-white">{hoveredRegion.name_en}</p>
				<p class="text-[10px] font-medium text-white/35 mt-0.5">{hoveredRegion.name_zh}</p>
				{#if primaryMeshKeys.includes(hoveredRegion.mesh_key)}
					<span class="mt-1 inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-[9px] font-bold text-red-300 uppercase tracking-wider">
						<span class="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse"></span>
						Primary
					</span>
				{:else if secondaryMeshKeys.includes(hoveredRegion.mesh_key)}
					<span class="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-bold text-amber-300 uppercase tracking-wider">
						<span class="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
						Secondary
					</span>
				{/if}
			</div>
		{/if}

		<div class="pointer-events-none absolute bottom-[16%] left-1/2 -translate-x-1/2 z-[5]
			rounded-full bg-black/30 backdrop-blur-sm
			px-3 py-1 text-[8px] font-medium text-white/30 border border-white/5">
			Drag to tilt
		</div>
	</div>

	{#if primaryMeshKeys.length > 0 || secondaryMeshKeys.length > 0}
		<div class="mt-3 flex items-center justify-center gap-6 text-[10px] font-bold text-white/30">
			{#if primaryMeshKeys.length > 0}
				<span class="flex items-center gap-2">
					<span class="relative flex h-2.5 w-2.5">
						<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-40"></span>
						<span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-400 shadow shadow-red-400/40"></span>
					</span>
					<span class="uppercase tracking-wider">Primary</span>
				</span>
			{/if}
			{#if secondaryMeshKeys.length > 0}
				<span class="flex items-center gap-2">
					<span class="inline-block h-2.5 w-2.5 rounded-full bg-amber-400/50"></span>
					<span class="uppercase tracking-wider">Secondary</span>
				</span>
			{/if}
		</div>
	{/if}
</div>
