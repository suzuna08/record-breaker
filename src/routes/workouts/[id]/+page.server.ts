import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { data: session } = await locals.supabase
		.from('workout_sessions')
		.select('*, exercise_logs(*, exercise:exercise_library(*))')
		.eq('id', params.id)
		.single();

	if (!session) return { session: null };

	const exerciseIds = (session.exercise_logs ?? []).map((l: any) => l.exercise_id);
	let mappings: any[] = [];

	if (exerciseIds.length > 0) {
		const { data } = await locals.supabase
			.from('exercise_muscle_map')
			.select('*, muscle:muscle_groups(name_en, name_zh, mesh_key)')
			.in('exercise_id', exerciseIds);
		mappings = data ?? [];
	}

	return { session, mappings };
};
