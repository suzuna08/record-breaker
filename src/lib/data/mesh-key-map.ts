/**
 * Mapping layer between GLB model mesh names and the app's mesh_key system.
 *
 * WHY: A GLB model from a 3D artist will have arbitrary mesh names like
 * "Pectoralis_Major_L" or "muscle_chest_001". Our database uses mesh_keys
 * like "chest_pectoralis_major". This module bridges the two.
 *
 * HOW TO USE:
 *   1. Load your GLB and call `buildMeshKeyIndex(gltf.scene)` once
 *   2. It traverses all meshes and returns a Map<meshKey, Mesh[]>
 *   3. Use `getMeshKey(mesh.name)` to resolve any single mesh → mesh_key
 *
 * HOW TO ADAPT TO A NEW MODEL:
 *   - Update GLB_TO_MESH_KEY with the new model's mesh names
 *   - Or rename the meshes inside Blender to match mesh_keys directly
 */

import * as THREE from 'three';
import { ANATOMY_REGIONS, REGION_COLORS } from '$lib/data/anatomy';

/**
 * Maps GLB mesh names → app mesh_keys.
 * Fill this in once you know your model's naming convention.
 * If a mesh name already matches a mesh_key, no entry is needed.
 */
export const GLB_TO_MESH_KEY: Record<string, string> = {
	// === Example mappings for a hypothetical model ===
	// Direct matches (no mapping needed, listed for documentation)
	// 'chest_pectoralis_major': 'chest_pectoralis_major',

	// Common alternative naming conventions:
	'Pectoralis_Major': 'chest_pectoralis_major',
	'Pectoralis_Major_L': 'chest_pectoralis_major',
	'Pectoralis_Major_R': 'chest_pectoralis_major',
	'Anterior_Deltoid': 'shoulder_anterior_deltoid',
	'Anterior_Deltoid_L': 'shoulder_anterior_deltoid',
	'Anterior_Deltoid_R': 'shoulder_anterior_deltoid',
	'Lateral_Deltoid': 'shoulder_lateral_deltoid',
	'Lateral_Deltoid_L': 'shoulder_lateral_deltoid',
	'Lateral_Deltoid_R': 'shoulder_lateral_deltoid',
	'Posterior_Deltoid': 'shoulder_posterior_deltoid',
	'Posterior_Deltoid_L': 'shoulder_posterior_deltoid',
	'Posterior_Deltoid_R': 'shoulder_posterior_deltoid',
	'Latissimus_Dorsi': 'back_latissimus_dorsi',
	'Latissimus_Dorsi_L': 'back_latissimus_dorsi',
	'Latissimus_Dorsi_R': 'back_latissimus_dorsi',
	'Trapezius': 'back_trapezius',
	'Trapezius_Upper': 'back_trapezius',
	'Rhomboid': 'back_rhomboids',
	'Rhomboid_L': 'back_rhomboids',
	'Rhomboid_R': 'back_rhomboids',
	'Biceps_Brachii': 'arm_biceps',
	'Biceps_Brachii_L': 'arm_biceps',
	'Biceps_Brachii_R': 'arm_biceps',
	'Triceps_Brachii': 'arm_triceps',
	'Triceps_Brachii_L': 'arm_triceps',
	'Triceps_Brachii_R': 'arm_triceps',
	'Rectus_Abdominis': 'core_rectus_abdominis',
	'Obliques': 'core_obliques',
	'Obliques_L': 'core_obliques',
	'Obliques_R': 'core_obliques',
	'Erector_Spinae': 'back_erector_spinae',
	'Erector_Spinae_L': 'back_erector_spinae',
	'Erector_Spinae_R': 'back_erector_spinae',
	'Gluteus_Maximus': 'leg_glutes',
	'Gluteus_Maximus_L': 'leg_glutes',
	'Gluteus_Maximus_R': 'leg_glutes',
	'Quadriceps': 'leg_quadriceps',
	'Quadriceps_L': 'leg_quadriceps',
	'Quadriceps_R': 'leg_quadriceps',
	'Rectus_Femoris': 'leg_quadriceps',
	'Vastus_Lateralis': 'leg_quadriceps',
	'Hamstrings': 'leg_hamstrings',
	'Hamstrings_L': 'leg_hamstrings',
	'Hamstrings_R': 'leg_hamstrings',
	'Biceps_Femoris': 'leg_hamstrings',
	'Gastrocnemius': 'leg_calves',
	'Gastrocnemius_L': 'leg_calves',
	'Gastrocnemius_R': 'leg_calves',
	'Calves': 'leg_calves',
	'Forearm': 'arm_forearms',
	'Forearm_L': 'arm_forearms',
	'Forearm_R': 'arm_forearms',
};

const VALID_MESH_KEYS = new Set(ANATOMY_REGIONS.map((r) => r.mesh_key));

/**
 * Resolve a GLB mesh name to an app mesh_key.
 * Checks: exact match → mapping table → fuzzy match.
 * Returns null if no match found.
 */
export function getMeshKey(meshName: string): string | null {
	if (VALID_MESH_KEYS.has(meshName)) return meshName;

	if (GLB_TO_MESH_KEY[meshName]) return GLB_TO_MESH_KEY[meshName];

	const lower = meshName.toLowerCase().replace(/[-\s]/g, '_');
	if (VALID_MESH_KEYS.has(lower)) return lower;

	for (const key of VALID_MESH_KEYS) {
		const parts = key.split('_').slice(1).join('_');
		if (lower.includes(parts)) return key;
	}

	return null;
}

/**
 * Walk a loaded GLTF scene and build a Map from mesh_key → Mesh[].
 * Multiple GLB meshes can map to the same mesh_key (e.g. left/right pairs).
 */
export function buildMeshKeyIndex(scene: THREE.Object3D): Map<string, THREE.Mesh[]> {
	const index = new Map<string, THREE.Mesh[]>();

	scene.traverse((child) => {
		if (!(child instanceof THREE.Mesh)) return;
		const key = getMeshKey(child.name);
		if (!key) return;

		const list = index.get(key) ?? [];
		list.push(child);
		index.set(key, list);
	});

	return index;
}

/**
 * Get the region color for a mesh_key.
 */
export function getRegionColor(meshKey: string): THREE.Color {
	const region = ANATOMY_REGIONS.find((r) => r.mesh_key === meshKey);
	if (!region) return new THREE.Color(0x6b7280);
	const hex = REGION_COLORS[region.region] ?? '#6b7280';
	return new THREE.Color(hex);
}

/**
 * Get the AnatomyRegion metadata for a mesh_key.
 */
export function getRegionForKey(meshKey: string) {
	return ANATOMY_REGIONS.find((r) => r.mesh_key === meshKey) ?? null;
}
