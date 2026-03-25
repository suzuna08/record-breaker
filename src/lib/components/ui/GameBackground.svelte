<script lang="ts">
	/**
	 * Dreamy animated background with cherry blossom petals,
	 * gradient sky, and a faint cityscape silhouette.
	 * Pure CSS -- no canvas or WebGL.
	 */
	const petals = Array.from({ length: 18 }, (_, i) => ({
		id: i,
		left: Math.random() * 100,
		delay: Math.random() * 12,
		duration: 8 + Math.random() * 8,
		size: 6 + Math.random() * 10,
		opacity: 0.15 + Math.random() * 0.3,
	}));
</script>

<div class="pointer-events-none fixed inset-0 z-0 overflow-hidden">
	<!-- Sky gradient -->
	<div class="absolute inset-0"
		style="background: linear-gradient(180deg,
			#2a1f3d 0%,
			#3d2858 20%,
			#5a3875 35%,
			#7a4a8a 50%,
			#c87aaa 65%,
			#f5a0b8 78%,
			#ffd6c0 90%,
			#ffecd2 100%);">
	</div>

	<!-- Stars layer -->
	<div class="absolute inset-0 opacity-40"
		style="background-image:
			radial-gradient(1px 1px at 10% 15%, white 50%, transparent 50%),
			radial-gradient(1px 1px at 25% 8%, white 50%, transparent 50%),
			radial-gradient(1.5px 1.5px at 40% 5%, white 50%, transparent 50%),
			radial-gradient(1px 1px at 55% 12%, white 50%, transparent 50%),
			radial-gradient(1px 1px at 70% 3%, white 50%, transparent 50%),
			radial-gradient(1.5px 1.5px at 85% 18%, white 50%, transparent 50%),
			radial-gradient(1px 1px at 15% 28%, white 50%, transparent 50%),
			radial-gradient(1px 1px at 60% 25%, white 50%, transparent 50%),
			radial-gradient(1px 1px at 90% 10%, white 50%, transparent 50%);">
	</div>

	<!-- City silhouette -->
	<div class="absolute bottom-0 left-0 right-0 h-[30%] opacity-20">
		<svg viewBox="0 0 1200 200" preserveAspectRatio="xMidYMax slice" class="absolute bottom-0 w-full h-full">
			<defs>
				<linearGradient id="cityGrad" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stop-color="#6a4a8a" stop-opacity="0.6" />
					<stop offset="100%" stop-color="#2a1f3d" stop-opacity="0.9" />
				</linearGradient>
			</defs>
			<path d="M0,200 L0,140 L40,140 L40,100 L60,100 L60,80 L70,80 L70,60 L80,60 L80,80 L100,80 L100,120 L120,120 L120,90 L130,90 L130,70 L140,70 L140,90 L160,90 L160,110 L200,110 L200,130 L220,130 L220,100 L240,100 L240,60 L250,50 L260,60 L260,90 L280,90 L280,120 L320,120 L320,80 L340,80 L340,50 L350,40 L360,50 L360,80 L380,80 L380,110 L400,110 L400,90 L420,90 L420,70 L440,70 L440,110 L480,110 L480,130 L520,130 L520,100 L540,100 L540,60 L550,55 L560,60 L560,90 L580,90 L580,120 L620,120 L620,85 L640,85 L640,65 L660,65 L660,95 L700,95 L700,130 L740,130 L740,110 L760,110 L760,75 L770,70 L780,75 L780,100 L800,100 L800,120 L840,120 L840,90 L860,90 L860,60 L870,55 L880,60 L880,100 L920,100 L920,130 L960,130 L960,105 L980,105 L980,80 L1000,80 L1000,110 L1040,110 L1040,130 L1080,130 L1080,95 L1100,95 L1100,75 L1120,75 L1120,110 L1160,110 L1160,140 L1200,140 L1200,200 Z"
				fill="url(#cityGrad)" />
			<!-- Windows -->
			<g fill="rgba(255,220,150,0.4)">
				<rect x="65" y="85" width="3" height="4" rx="0.5" />
				<rect x="73" y="65" width="3" height="4" rx="0.5" />
				<rect x="125" y="75" width="3" height="4" rx="0.5" />
				<rect x="245" y="65" width="3" height="4" rx="0.5" />
				<rect x="345" y="55" width="3" height="4" rx="0.5" />
				<rect x="345" y="65" width="3" height="4" rx="0.5" />
				<rect x="425" y="75" width="3" height="4" rx="0.5" />
				<rect x="545" y="65" width="3" height="4" rx="0.5" />
				<rect x="645" y="70" width="3" height="4" rx="0.5" />
				<rect x="765" y="78" width="3" height="4" rx="0.5" />
				<rect x="865" y="65" width="3" height="4" rx="0.5" />
				<rect x="985" y="85" width="3" height="4" rx="0.5" />
				<rect x="1105" y="80" width="3" height="4" rx="0.5" />
			</g>
		</svg>
	</div>

	<!-- Cherry blossom petals -->
	{#each petals as petal (petal.id)}
		<div
			class="absolute rounded-full"
			style="
				left: {petal.left}%;
				width: {petal.size}px;
				height: {petal.size * 0.7}px;
				opacity: {petal.opacity};
				background: radial-gradient(ellipse, #ffb8d0, #ff8fb3);
				animation: petal-fall {petal.duration}s {petal.delay}s linear infinite;
				filter: blur(0.5px);
			"
		></div>
	{/each}

	<!-- Warm glow at bottom -->
	<div class="absolute bottom-0 left-0 right-0 h-[20%]"
		style="background: linear-gradient(to top, rgba(255, 210, 180, 0.08), transparent);">
	</div>
</div>
