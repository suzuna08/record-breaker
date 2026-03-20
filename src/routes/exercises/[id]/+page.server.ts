import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { data: exercise } = await locals.supabase
		.from('exercise_library')
		.select('*')
		.eq('id', params.id)
		.single();

	if (!exercise) {
		return { status: 404, exercise: null, primaryMuscles: [], secondaryMuscles: [] };
	}

	const { data: mappings } = await locals.supabase
		.from('exercise_muscle_map')
		.select('*, muscle:muscle_groups(*)')
		.eq('exercise_id', params.id);

	const primaryMuscles = (mappings ?? []).filter((m) => m.role === 'primary').map((m) => m.muscle);
	const secondaryMuscles = (mappings ?? []).filter((m) => m.role === 'secondary').map((m) => m.muscle);

	return { exercise, primaryMuscles, secondaryMuscles };
};
