import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data: exercises } = await locals.supabase
		.from('exercise_library')
		.select('*')
		.order('name_en');

	const { data: mappings } = await locals.supabase
		.from('exercise_muscle_map')
		.select('*, muscle:muscle_groups(name_en, name_zh, mesh_key)')
		.order('role');

	return {
		exercises: exercises ?? [],
		mappings: mappings ?? []
	};
};
