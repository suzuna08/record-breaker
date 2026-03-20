import type { MuscleGroup } from '$lib/types';

export interface AnatomyRegion {
	mesh_key: string;
	name_en: string;
	name_zh: string;
	region: string;
	description: string;
	path: string;
	cx: number;
	cy: number;
	rx: number;
	ry: number;
}

/**
 * 2D SVG-based muscle map for the placeholder anatomy view.
 * Each region defines an ellipse/area on a front-facing body silhouette.
 * cx/cy are percentage-based coordinates (0-100 range mapped to viewBox).
 * When a real GLB model is loaded, these can be replaced with mesh_key lookups.
 */
export const ANATOMY_REGIONS: AnatomyRegion[] = [
	{ mesh_key: 'chest_pectoralis_major', name_en: 'Pectoralis Major', name_zh: '胸大肌', region: 'chest', description: 'Large fan-shaped muscle of the chest responsible for arm adduction, flexion, and internal rotation.', path: '', cx: 50, cy: 28, rx: 14, ry: 5 },
	{ mesh_key: 'shoulder_anterior_deltoid', name_en: 'Anterior Deltoid', name_zh: '三角肌前束', region: 'shoulders', description: 'Front portion of the deltoid; involved in shoulder flexion and pressing movements.', path: '', cx: 33, cy: 22, rx: 4, ry: 4 },
	{ mesh_key: 'shoulder_lateral_deltoid', name_en: 'Lateral Deltoid', name_zh: '三角肌中束', region: 'shoulders', description: 'Middle portion of the deltoid; primary mover for shoulder abduction.', path: '', cx: 28, cy: 23, rx: 4, ry: 4 },
	{ mesh_key: 'shoulder_posterior_deltoid', name_en: 'Posterior Deltoid', name_zh: '三角肌後束', region: 'shoulders', description: 'Rear portion of the deltoid; assists in shoulder extension and external rotation.', path: '', cx: 67, cy: 22, rx: 4, ry: 4 },
	{ mesh_key: 'back_latissimus_dorsi', name_en: 'Latissimus Dorsi', name_zh: '闊背肌', region: 'back', description: 'Large muscle of the back responsible for shoulder extension, adduction, and internal rotation.', path: '', cx: 50, cy: 38, rx: 16, ry: 6 },
	{ mesh_key: 'back_trapezius', name_en: 'Trapezius', name_zh: '斜方肌', region: 'back', description: 'Large triangular muscle spanning the upper back and neck; controls scapular movement.', path: '', cx: 50, cy: 18, rx: 10, ry: 4 },
	{ mesh_key: 'back_rhomboids', name_en: 'Rhomboids', name_zh: '菱形肌', region: 'back', description: 'Deep muscles between the spine and scapula; retract and stabilize the shoulder blade.', path: '', cx: 50, cy: 32, rx: 6, ry: 4 },
	{ mesh_key: 'arm_biceps', name_en: 'Biceps Brachii', name_zh: '肱二頭肌', region: 'arms', description: 'Two-headed muscle of the upper arm; flexes the elbow and supinates the forearm.', path: '', cx: 26, cy: 33, rx: 3, ry: 6 },
	{ mesh_key: 'arm_triceps', name_en: 'Triceps Brachii', name_zh: '肱三頭肌', region: 'arms', description: 'Three-headed muscle on the back of the upper arm; extends the elbow.', path: '', cx: 74, cy: 33, rx: 3, ry: 6 },
	{ mesh_key: 'core_rectus_abdominis', name_en: 'Rectus Abdominis', name_zh: '腹直肌', region: 'core', description: 'Paired muscle running vertically along the abdomen; flexes the trunk.', path: '', cx: 50, cy: 45, rx: 6, ry: 8 },
	{ mesh_key: 'core_obliques', name_en: 'Obliques', name_zh: '腹斜肌', region: 'core', description: 'Lateral abdominal muscles involved in trunk rotation and lateral flexion.', path: '', cx: 42, cy: 44, rx: 4, ry: 6 },
	{ mesh_key: 'back_erector_spinae', name_en: 'Erector Spinae', name_zh: '豎脊肌', region: 'back', description: 'Group of muscles along the spine that extend and laterally flex the trunk.', path: '', cx: 50, cy: 42, rx: 3, ry: 10 },
	{ mesh_key: 'leg_glutes', name_en: 'Gluteus Maximus', name_zh: '臀大肌', region: 'legs', description: 'Largest muscle of the buttocks; primary hip extensor.', path: '', cx: 50, cy: 56, rx: 12, ry: 5 },
	{ mesh_key: 'leg_quadriceps', name_en: 'Quadriceps', name_zh: '股四頭肌', region: 'legs', description: 'Four-headed muscle group on the front of the thigh; extends the knee.', path: '', cx: 42, cy: 68, rx: 6, ry: 10 },
	{ mesh_key: 'leg_hamstrings', name_en: 'Hamstrings', name_zh: '腿後肌群', region: 'legs', description: 'Three muscles on the back of the thigh; flex the knee and extend the hip.', path: '', cx: 58, cy: 68, rx: 6, ry: 10 },
	{ mesh_key: 'leg_calves', name_en: 'Calves', name_zh: '小腿肌（腓腸肌）', region: 'legs', description: 'Two-headed muscle of the lower leg; plantar flexes the ankle.', path: '', cx: 44, cy: 84, rx: 4, ry: 6 },
	{ mesh_key: 'arm_forearms', name_en: 'Forearms', name_zh: '前臂肌群', region: 'arms', description: 'Muscle group controlling wrist and finger movements; grip strength.', path: '', cx: 24, cy: 43, rx: 3, ry: 5 },
];

export const REGION_COLORS: Record<string, string> = {
	chest: '#ef4444',
	shoulders: '#f97316',
	back: '#8b5cf6',
	arms: '#3b82f6',
	core: '#22c55e',
	legs: '#eab308',
};
