/**
 * Stylized muscle region configuration for the game-like character viewer.
 *
 * Maps each mesh_key to visual highlight parameters:
 *   - glowColor: primary highlight (warm energy, per-region)
 *   - accentColor: secondary accent for outlines/particles
 *   - pulseSpeed: animation speed multiplier
 *   - glowIntensity: base emissive strength when active
 *
 * This file does NOT change the data layer. It only adds visual config
 * consumed by MuscleCharacterScene.svelte.
 */

export interface MuscleRegionStyle {
	glowColor: number;
	accentColor: number;
	pulseSpeed: number;
	glowIntensity: number;
	label: string;
}

export const MUSCLE_REGION_STYLES: Record<string, MuscleRegionStyle> = {
	// Chest
	chest_pectoralis_major: {
		glowColor: 0xff6b4a,
		accentColor: 0xffb088,
		pulseSpeed: 1.0,
		glowIntensity: 0.9,
		label: 'Pecs',
	},

	// Shoulders
	shoulder_anterior_deltoid: {
		glowColor: 0xff8c42,
		accentColor: 0xffc18a,
		pulseSpeed: 1.1,
		glowIntensity: 0.85,
		label: 'Front Delt',
	},
	shoulder_lateral_deltoid: {
		glowColor: 0xffa044,
		accentColor: 0xffd4a0,
		pulseSpeed: 1.1,
		glowIntensity: 0.85,
		label: 'Side Delt',
	},
	shoulder_posterior_deltoid: {
		glowColor: 0xff9040,
		accentColor: 0xffc890,
		pulseSpeed: 1.1,
		glowIntensity: 0.85,
		label: 'Rear Delt',
	},

	// Back
	back_latissimus_dorsi: {
		glowColor: 0xa855f7,
		accentColor: 0xd4a0ff,
		pulseSpeed: 0.9,
		glowIntensity: 0.85,
		label: 'Lats',
	},
	back_trapezius: {
		glowColor: 0xb468f8,
		accentColor: 0xd9b0ff,
		pulseSpeed: 0.9,
		glowIntensity: 0.85,
		label: 'Traps',
	},
	back_rhomboids: {
		glowColor: 0x9d4ddd,
		accentColor: 0xc490f0,
		pulseSpeed: 0.9,
		glowIntensity: 0.8,
		label: 'Rhomboids',
	},
	back_erector_spinae: {
		glowColor: 0x8b3dc8,
		accentColor: 0xb880e0,
		pulseSpeed: 0.8,
		glowIntensity: 0.75,
		label: 'Erectors',
	},

	// Arms
	arm_biceps: {
		glowColor: 0x3b9dff,
		accentColor: 0x88c8ff,
		pulseSpeed: 1.2,
		glowIntensity: 0.9,
		label: 'Biceps',
	},
	arm_triceps: {
		glowColor: 0x5588ff,
		accentColor: 0x99bbff,
		pulseSpeed: 1.1,
		glowIntensity: 0.85,
		label: 'Triceps',
	},
	arm_forearms: {
		glowColor: 0x4488ee,
		accentColor: 0x88aaee,
		pulseSpeed: 1.0,
		glowIntensity: 0.8,
		label: 'Forearms',
	},

	// Core
	core_rectus_abdominis: {
		glowColor: 0x34d399,
		accentColor: 0x88f0c8,
		pulseSpeed: 1.0,
		glowIntensity: 0.9,
		label: 'Abs',
	},
	core_obliques: {
		glowColor: 0x22c55e,
		accentColor: 0x77e8a0,
		pulseSpeed: 1.0,
		glowIntensity: 0.85,
		label: 'Obliques',
	},

	// Legs
	leg_glutes: {
		glowColor: 0xeab308,
		accentColor: 0xf5d870,
		pulseSpeed: 0.9,
		glowIntensity: 0.85,
		label: 'Glutes',
	},
	leg_quadriceps: {
		glowColor: 0xf59e0b,
		accentColor: 0xfcd070,
		pulseSpeed: 1.0,
		glowIntensity: 0.9,
		label: 'Quads',
	},
	leg_hamstrings: {
		glowColor: 0xd97706,
		accentColor: 0xf0c060,
		pulseSpeed: 0.9,
		glowIntensity: 0.85,
		label: 'Hamstrings',
	},
	leg_calves: {
		glowColor: 0xca8a04,
		accentColor: 0xe8c850,
		pulseSpeed: 1.0,
		glowIntensity: 0.8,
		label: 'Calves',
	},
};

export function getRegionStyle(meshKey: string): MuscleRegionStyle {
	return MUSCLE_REGION_STYLES[meshKey] ?? {
		glowColor: 0xff6b4a,
		accentColor: 0xffb088,
		pulseSpeed: 1.0,
		glowIntensity: 0.8,
		label: meshKey,
	};
}

/**
 * Category-level glow tints used for the energy ring on the podium.
 */
export const REGION_GLOW_TINTS: Record<string, number> = {
	chest: 0xff6b4a,
	shoulders: 0xff8c42,
	back: 0xa855f7,
	arms: 0x3b9dff,
	core: 0x34d399,
	legs: 0xeab308,
};
