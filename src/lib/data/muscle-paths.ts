/**
 * Anatomically-shaped SVG paths for front and back muscle groups.
 * Each muscle is keyed by its mesh_key to link with the database.
 * viewBox: 200 x 400 coordinate space. Body centered at x=100.
 *
 * Character: heroic anime-proportioned boy, broader shoulders, defined waist,
 * slightly larger head. Muscle paths hug the body contour for integrated look.
 */

export interface MusclePath {
	mesh_key: string;
	name_en: string;
	name_zh: string;
	region: string;
	view: 'front' | 'back' | 'both';
	paths: string[];
	mirror?: string[];
}

/* ------------------------------------------------------------------ */
/*  FRONT VIEW                                                         */
/* ------------------------------------------------------------------ */

export const FRONT_BODY_OUTLINE = `
M 100,10
C 88,10 81,18 81,28
C 81,36 84,40 87,43
L 83,45
C 77,46 71,49 66,54
L 58,50 C 50,48 43,52 40,58
C 37,64 35,72 33,82
L 29,104 C 27,114 26,124 26,132
C 26,136 27,140 30,142
L 36,140 C 39,138 42,134 43,130
C 44,132 48,135 54,136
C 54,138 53,142 54,148
C 55,152 58,156 62,158
C 60,164 58,174 56,186
L 54,208 C 52,226 51,244 51,262
C 51,278 51,294 52,310
C 52,322 51,334 50,344
C 49,354 47,362 46,370
L 44,378 C 43,382 45,388 50,390
L 60,390 C 62,388 64,384 64,378
L 66,364 C 68,350 70,334 72,316
L 80,272 C 84,250 88,230 92,214
C 95,202 98,192 100,184
L 100,184
C 102,192 105,202 108,214
C 112,230 116,250 120,272
L 128,316 C 130,334 132,350 134,364
L 136,378 C 136,384 138,388 140,390
L 150,390 C 155,388 157,382 156,378
L 154,370 C 153,362 151,354 150,344
C 149,334 149,322 148,310
C 149,294 149,278 149,262
C 149,244 148,226 146,208
L 144,186 C 142,174 140,164 138,158
C 142,156 145,152 146,148
C 147,142 146,138 146,136
C 152,135 156,132 157,130
C 158,134 161,138 164,140
L 170,142 C 173,140 174,136 174,132
C 174,124 173,114 171,104
L 167,82 C 165,72 163,64 160,58
C 157,52 150,48 142,50
L 134,54 C 129,49 123,46 117,45
L 113,43 C 116,40 119,36 119,28
C 119,18 112,10 100,10 Z`;

export const FRONT_HEAD = `
M 100,10
C 88,10 81,18 81,28
C 81,36 84,40 87,43
L 83,45 C 88,47 94,48 100,48
C 106,48 112,47 117,45
L 113,43 C 116,40 119,36 119,28
C 119,18 112,10 100,10 Z`;

/**
 * Muscle definition lines drawn on top of the body in a darker skin tone.
 * These are always visible to give the body muscular structure.
 */
export const FRONT_DEFINITION_LINES: string[] = [
	// Pec separation (center chest line)
	'M 100,58 L 100,76',
	// Pec lower boundary left
	'M 70,60 C 74,68 82,74 94,76',
	// Pec lower boundary right
	'M 130,60 C 126,68 118,74 106,76',
	// Collarbone left
	'M 84,48 C 78,50 72,53 66,54',
	// Collarbone right
	'M 116,48 C 122,50 128,53 134,54',
	// Deltoid cap left
	'M 54,58 C 50,64 48,72 50,76',
	// Deltoid cap right
	'M 146,58 C 150,64 152,72 150,76',
	// Ab midline
	'M 100,78 L 100,142',
	// Ab horizontal lines
	'M 92,86 L 108,86',
	'M 91,98 L 109,98',
	'M 91,110 L 109,110',
	'M 92,122 L 108,122',
	// Oblique side lines left
	'M 88,78 C 84,90 80,110 78,128',
	// Oblique side lines right
	'M 112,78 C 116,90 120,110 122,128',
	// Bicep definition left
	'M 48,76 C 46,84 44,96 44,106',
	// Bicep definition right
	'M 152,76 C 154,84 156,96 156,106',
	// Inner elbow left
	'M 44,110 C 46,114 48,116 50,118',
	// Inner elbow right
	'M 156,110 C 154,114 152,116 150,118',
	// Quad center line left
	'M 80,164 C 78,200 74,240 72,270',
	// Quad center line right
	'M 120,164 C 122,200 126,240 128,270',
	// Knee cap left
	'M 66,282 C 70,288 76,288 80,282',
	// Knee cap right
	'M 134,282 C 130,288 124,288 120,282',
];

/**
 * Shadow/shading areas drawn with very low opacity for depth.
 */
export const FRONT_SHADOWS: string[] = [
	// Under-chin shadow
	'M 87,43 C 92,46 96,47 100,47 C 104,47 108,46 113,43 L 117,45 C 112,50 106,52 100,52 C 94,52 88,50 83,45 Z',
	// Under-pec shadow left
	'M 70,62 C 76,70 84,76 94,78 L 88,80 C 78,78 72,72 68,66 Z',
	// Under-pec shadow right
	'M 130,62 C 124,70 116,76 106,78 L 112,80 C 122,78 128,72 132,66 Z',
	// Inner arm shadow left
	'M 52,72 C 50,80 48,92 46,104 L 50,104 C 52,92 54,80 54,72 Z',
	// Inner arm shadow right
	'M 148,72 C 150,80 152,92 154,104 L 150,104 C 148,92 146,80 146,72 Z',
	// Navel area
	'M 96,130 C 98,134 100,136 100,136 C 100,136 102,134 104,130 L 104,138 C 102,140 100,142 100,142 C 100,142 98,140 96,138 Z',
	// Inner thigh shadow left
	'M 84,162 C 86,180 88,200 90,220 L 86,220 C 84,200 82,180 82,162 Z',
	// Inner thigh shadow right
	'M 116,162 C 114,180 112,200 110,220 L 114,220 C 116,200 118,180 118,162 Z',
];

export const FRONT_MUSCLES: MusclePath[] = [
	{
		mesh_key: 'chest_pectoralis_major',
		name_en: 'Pectoralis Major',
		name_zh: '胸大肌',
		region: 'chest',
		view: 'front',
		paths: [
			'M 68,54 C 72,52 82,50 98,54 L 98,60 C 98,66 96,72 94,76 C 88,80 80,78 74,72 C 70,68 68,62 68,58 Z',
		],
		mirror: [
			'M 132,54 C 128,52 118,50 102,54 L 102,60 C 102,66 104,72 106,76 C 112,80 120,78 126,72 C 130,68 132,62 132,58 Z',
		],
	},

	{
		mesh_key: 'shoulder_anterior_deltoid',
		name_en: 'Anterior Deltoid',
		name_zh: '三角肌前束',
		region: 'shoulders',
		view: 'front',
		paths: [
			'M 66,54 C 62,52 56,52 52,56 C 48,60 46,66 46,72 L 48,76 C 52,74 56,68 60,62 L 66,56 Z',
		],
		mirror: [
			'M 134,54 C 138,52 144,52 148,56 C 152,60 154,66 154,72 L 152,76 C 148,74 144,68 140,62 L 134,56 Z',
		],
	},
	{
		mesh_key: 'shoulder_lateral_deltoid',
		name_en: 'Lateral Deltoid',
		name_zh: '三角肌中束',
		region: 'shoulders',
		view: 'front',
		paths: [
			'M 52,56 C 46,54 42,56 40,60 C 38,66 38,72 40,78 L 44,80 C 46,74 48,66 50,60 L 52,56 Z',
		],
		mirror: [
			'M 148,56 C 154,54 158,56 160,60 C 162,66 162,72 160,78 L 156,80 C 154,74 152,66 150,60 L 148,56 Z',
		],
	},

	{
		mesh_key: 'arm_biceps',
		name_en: 'Biceps Brachii',
		name_zh: '肱二頭肌',
		region: 'arms',
		view: 'front',
		paths: [
			'M 44,80 C 42,86 38,96 36,106 C 34,114 36,118 40,118 C 44,116 48,110 50,102 C 54,92 54,82 52,78 L 48,76 Z',
		],
		mirror: [
			'M 156,80 C 158,86 162,96 164,106 C 166,114 164,118 160,118 C 156,116 152,110 150,102 C 146,92 146,82 148,78 L 152,76 Z',
		],
	},
	{
		mesh_key: 'arm_forearms',
		name_en: 'Forearms',
		name_zh: '前臂肌群',
		region: 'arms',
		view: 'front',
		paths: [
			'M 38,120 C 36,126 32,134 30,140 C 30,142 32,142 36,140 L 42,138 C 44,134 44,126 44,120 L 40,118 Z',
		],
		mirror: [
			'M 162,120 C 164,126 168,134 170,140 C 170,142 168,142 164,140 L 158,138 C 156,134 156,126 156,120 L 160,118 Z',
		],
	},

	{
		mesh_key: 'core_rectus_abdominis',
		name_en: 'Rectus Abdominis',
		name_zh: '腹直肌',
		region: 'core',
		view: 'front',
		paths: [
			'M 93,80 Q 96,79 99,80 L 99,90 Q 96,91 93,90 Z',
			'M 93,93 Q 96,92 99,93 L 99,104 Q 96,105 93,104 Z',
			'M 93,107 Q 96,106 99,107 L 99,118 Q 95,120 92,118 Z',
			'M 101,80 Q 104,79 107,80 L 107,90 Q 104,91 101,90 Z',
			'M 101,93 Q 104,92 107,93 L 107,104 Q 104,105 101,104 Z',
			'M 101,107 Q 104,106 107,107 L 108,118 Q 105,120 101,118 Z',
		],
	},
	{
		mesh_key: 'core_obliques',
		name_en: 'Obliques',
		name_zh: '腹斜肌',
		region: 'core',
		view: 'front',
		paths: [
			'M 74,78 C 78,76 84,76 90,78 L 90,84 C 88,98 86,112 84,126 C 80,132 76,130 74,122 C 72,112 72,94 74,84 Z',
		],
		mirror: [
			'M 126,78 C 122,76 116,76 110,78 L 110,84 C 112,98 114,112 116,126 C 120,132 124,130 126,122 C 128,112 128,94 126,84 Z',
		],
	},

	{
		mesh_key: 'leg_quadriceps',
		name_en: 'Quadriceps',
		name_zh: '股四頭肌',
		region: 'legs',
		view: 'front',
		paths: [
			'M 72,164 C 68,178 64,196 62,216 C 60,236 58,256 58,270 C 58,278 60,284 64,286 L 72,288 C 76,284 78,276 80,266 C 82,250 84,232 84,214 C 84,194 82,176 80,164 Z',
			'M 84,168 C 82,180 80,198 78,216 L 76,240 C 76,256 76,268 78,276 L 84,284 C 88,280 90,272 92,262 C 94,248 94,232 92,216 L 90,198 C 88,182 86,172 84,168 Z',
		],
		mirror: [
			'M 128,164 C 132,178 136,196 138,216 C 140,236 142,256 142,270 C 142,278 140,284 136,286 L 128,288 C 124,284 122,276 120,266 C 118,250 116,232 116,214 C 116,194 118,176 120,164 Z',
			'M 116,168 C 118,180 120,198 122,216 L 124,240 C 124,256 124,268 122,276 L 116,284 C 112,280 110,272 108,262 C 106,248 106,232 108,216 L 110,198 C 112,182 114,172 116,168 Z',
		],
	},
	{
		mesh_key: 'leg_calves',
		name_en: 'Calves',
		name_zh: '小腿肌（腓腸肌）',
		region: 'legs',
		view: 'front',
		paths: [
			'M 62,296 C 60,306 58,320 56,336 C 54,350 54,362 56,370 L 62,372 C 66,366 68,352 70,338 C 72,322 72,308 70,298 Z',
		],
		mirror: [
			'M 138,296 C 140,306 142,320 144,336 C 146,350 146,362 144,370 L 138,372 C 134,366 132,352 130,338 C 128,322 128,308 130,298 Z',
		],
	},
];

/* ------------------------------------------------------------------ */
/*  BACK VIEW                                                          */
/* ------------------------------------------------------------------ */

export const BACK_BODY_OUTLINE = FRONT_BODY_OUTLINE;
export const BACK_HEAD = FRONT_HEAD;

export const BACK_DEFINITION_LINES: string[] = [
	// Spine
	'M 100,48 L 100,142',
	// Scapula outline left
	'M 90,56 C 84,60 80,66 80,72 C 80,78 84,82 90,80',
	// Scapula outline right
	'M 110,56 C 116,60 120,66 120,72 C 120,78 116,82 110,80',
	// Lat sweep left
	'M 74,66 C 70,80 68,100 72,120',
	// Lat sweep right
	'M 126,66 C 130,80 132,100 128,120',
	// Lower back dimples
	'M 94,130 C 96,134 98,136 100,136',
	'M 106,130 C 104,134 102,136 100,136',
	// Glute crease
	'M 68,178 C 80,184 90,186 100,186 C 110,186 120,184 132,178',
	// Hamstring separation left
	'M 78,186 C 76,210 74,240 74,270',
	// Hamstring separation right
	'M 122,186 C 124,210 126,240 126,270',
];

export const BACK_SHADOWS: string[] = [
	// Spine groove
	'M 98,50 L 98,140 L 102,140 L 102,50 Z',
	// Under shoulder shadow left
	'M 54,72 C 52,80 50,90 50,96 L 54,96 C 56,90 56,80 56,72 Z',
	// Under shoulder shadow right
	'M 146,72 C 148,80 150,90 150,96 L 146,96 C 144,90 144,80 144,72 Z',
];

export const BACK_MUSCLES: MusclePath[] = [
	{
		mesh_key: 'back_trapezius',
		name_en: 'Trapezius',
		name_zh: '斜方肌',
		region: 'back',
		view: 'back',
		paths: [
			'M 98,44 C 92,46 84,50 78,54 L 72,58 C 76,64 82,66 90,64 L 98,58 L 98,48 Z',
		],
		mirror: [
			'M 102,44 C 108,46 116,50 122,54 L 128,58 C 124,64 118,66 110,64 L 102,58 L 102,48 Z',
		],
	},

	{
		mesh_key: 'shoulder_posterior_deltoid',
		name_en: 'Posterior Deltoid',
		name_zh: '三角肌後束',
		region: 'shoulders',
		view: 'back',
		paths: [
			'M 68,54 C 62,56 54,62 50,68 L 48,74 C 52,78 58,76 62,72 L 68,62 Z',
		],
		mirror: [
			'M 132,54 C 138,56 146,62 150,68 L 152,74 C 148,78 142,76 138,72 L 132,62 Z',
		],
	},

	{
		mesh_key: 'back_rhomboids',
		name_en: 'Rhomboids',
		name_zh: '菱形肌',
		region: 'back',
		view: 'back',
		paths: [
			'M 96,58 C 92,62 88,68 86,74 L 88,80 C 92,82 96,78 97,74 L 98,64 Z',
		],
		mirror: [
			'M 104,58 C 108,62 112,68 114,74 L 112,80 C 108,82 104,78 103,74 L 102,64 Z',
		],
	},
	{
		mesh_key: 'back_latissimus_dorsi',
		name_en: 'Latissimus Dorsi',
		name_zh: '闊背肌',
		region: 'back',
		view: 'back',
		paths: [
			'M 80,64 C 74,70 70,80 68,92 C 66,104 68,116 72,126 C 76,134 82,138 88,136 L 96,126 C 98,114 98,100 96,88 L 90,74 C 88,68 84,64 80,64 Z',
		],
		mirror: [
			'M 120,64 C 126,70 130,80 132,92 C 134,104 132,116 128,126 C 124,134 118,138 112,136 L 104,126 C 102,114 102,100 104,88 L 110,74 C 112,68 116,64 120,64 Z',
		],
	},
	{
		mesh_key: 'back_erector_spinae',
		name_en: 'Erector Spinae',
		name_zh: '豎脊肌',
		region: 'back',
		view: 'back',
		paths: [
			'M 96,72 C 94,82 93,96 93,110 L 93,128 C 93,134 94,140 96,144 L 98,140 C 98,130 98,116 98,102 L 98,80 Z',
		],
		mirror: [
			'M 104,72 C 106,82 107,96 107,110 L 107,128 C 107,134 106,140 104,144 L 102,140 C 102,130 102,116 102,102 L 102,80 Z',
		],
	},

	{
		mesh_key: 'arm_triceps',
		name_en: 'Triceps Brachii',
		name_zh: '肱三頭肌',
		region: 'arms',
		view: 'back',
		paths: [
			'M 48,76 C 46,82 42,94 38,106 C 36,114 38,118 42,118 C 44,116 48,108 50,100 C 54,90 56,80 54,76 Z',
		],
		mirror: [
			'M 152,76 C 154,82 158,94 162,106 C 164,114 162,118 158,118 C 156,116 152,108 150,100 C 146,90 144,80 146,76 Z',
		],
	},

	{
		mesh_key: 'leg_glutes',
		name_en: 'Gluteus Maximus',
		name_zh: '臀大肌',
		region: 'legs',
		view: 'back',
		paths: [
			'M 98,148 C 92,150 82,156 76,164 C 70,172 66,178 66,184 C 68,188 76,190 84,188 C 92,186 98,178 98,168 L 98,156 Z',
		],
		mirror: [
			'M 102,148 C 108,150 118,156 124,164 C 130,172 134,178 134,184 C 132,188 124,190 116,188 C 108,186 102,178 102,168 L 102,156 Z',
		],
	},

	{
		mesh_key: 'leg_hamstrings',
		name_en: 'Hamstrings',
		name_zh: '腿後肌群',
		region: 'legs',
		view: 'back',
		paths: [
			'M 70,190 C 66,200 62,218 60,238 C 58,258 58,274 60,286 L 68,290 C 72,280 74,268 76,252 C 78,234 78,214 76,198 C 74,192 72,190 70,190 Z',
			'M 82,190 C 80,200 78,218 76,238 C 74,258 74,274 76,286 L 84,290 C 88,282 90,268 92,252 C 94,234 94,216 92,200 C 90,192 86,190 82,190 Z',
		],
		mirror: [
			'M 130,190 C 134,200 138,218 140,238 C 142,258 142,274 140,286 L 132,290 C 128,280 126,268 124,252 C 122,234 122,214 124,198 C 126,192 128,190 130,190 Z',
			'M 118,190 C 120,200 122,218 124,238 C 126,258 126,274 124,286 L 116,290 C 112,282 110,268 108,252 C 106,234 106,216 108,200 C 110,192 114,190 118,190 Z',
		],
	},

	{
		mesh_key: 'leg_calves',
		name_en: 'Calves',
		name_zh: '小腿肌（腓腸肌）',
		region: 'legs',
		view: 'back',
		paths: [
			'M 64,296 C 60,306 58,320 56,336 C 54,350 56,362 58,368 L 64,366 C 66,356 68,342 70,326 C 72,312 70,300 64,296 Z',
			'M 78,296 C 80,306 80,320 78,336 C 76,350 74,360 72,368 L 78,370 C 82,364 86,350 86,336 C 86,318 84,304 78,296 Z',
		],
		mirror: [
			'M 136,296 C 140,306 142,320 144,336 C 146,350 144,362 142,368 L 136,366 C 134,356 132,342 130,326 C 128,312 130,300 136,296 Z',
			'M 122,296 C 120,306 120,320 122,336 C 124,350 126,360 128,368 L 122,370 C 118,364 114,350 114,336 C 114,318 116,304 122,296 Z',
		],
	},
];

export const ALL_MUSCLE_PATHS = [...FRONT_MUSCLES, ...BACK_MUSCLES];

export function getMusclesForView(view: 'front' | 'back'): MusclePath[] {
	if (view === 'front') return FRONT_MUSCLES;
	return BACK_MUSCLES;
}
