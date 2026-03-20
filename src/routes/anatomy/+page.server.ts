import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data: muscles } = await locals.supabase
		.from('muscle_groups')
		.select('*')
		.order('region');

	const { data: exercises } = await locals.supabase
		.from('exercise_library')
		.select('*')
		.order('name_en');

	const { data: mappings } = await locals.supabase
		.from('exercise_muscle_map')
		.select('*');

	return {
		muscles: muscles ?? [],
		exercises: exercises ?? [],
		mappings: mappings ?? []
	};
};
