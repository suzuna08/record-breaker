import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const search = url.searchParams.get('q') || '';
	const muscleFilter = url.searchParams.get('muscle') || '';

	let exerciseQuery = locals.supabase
		.from('exercise_library')
		.select('*')
		.order('name_en');

	if (search) {
		exerciseQuery = exerciseQuery.or(`name_en.ilike.%${search}%,name_zh.ilike.%${search}%`);
	}

	const { data: exercises } = await exerciseQuery;

	const { data: muscles } = await locals.supabase
		.from('muscle_groups')
		.select('*')
		.order('region, name_en');

	const { data: mappings } = await locals.supabase
		.from('exercise_muscle_map')
		.select('*');

	let filteredExercises = exercises ?? [];

	if (muscleFilter && mappings) {
		const exerciseIdsForMuscle = new Set(
			mappings.filter((m) => m.muscle_id === muscleFilter).map((m) => m.exercise_id)
		);
		filteredExercises = filteredExercises.filter((e) => exerciseIdsForMuscle.has(e.id));
	}

	return {
		exercises: filteredExercises,
		muscles: muscles ?? [],
		mappings: mappings ?? [],
		search,
		muscleFilter
	};
};
