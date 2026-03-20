import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { session } = await locals.safeGetSession();
	if (!session) return { profile: null, recentSessions: [], weekCount: 0, recentMuscles: [], photoCount: 0 };

	const userId = session.user.id;

	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('*')
		.eq('id', userId)
		.single();

	const { data: recentSessions } = await locals.supabase
		.from('workout_sessions')
		.select('*, exercise_logs(exercise_id)')
		.eq('user_id', userId)
		.order('session_date', { ascending: false })
		.limit(5);

	const weekAgo = new Date();
	weekAgo.setDate(weekAgo.getDate() - 7);
	const { count: weekCount } = await locals.supabase
		.from('workout_sessions')
		.select('id', { count: 'exact', head: true })
		.eq('user_id', userId)
		.gte('session_date', weekAgo.toISOString().split('T')[0]);

	// Get muscles trained recently
	const recentExerciseIds = (recentSessions ?? [])
		.flatMap((s: any) => (s.exercise_logs ?? []).map((l: any) => l.exercise_id));

	let recentMuscles: any[] = [];
	if (recentExerciseIds.length > 0) {
		const { data: mappings } = await locals.supabase
			.from('exercise_muscle_map')
			.select('muscle:muscle_groups(name_en, name_zh, mesh_key)')
			.in('exercise_id', recentExerciseIds)
			.eq('role', 'primary');

		const seen = new Set<string>();
		recentMuscles = (mappings ?? [])
			.map((m: any) => m.muscle)
			.filter((m: any) => {
				if (!m || seen.has(m.mesh_key)) return false;
				seen.add(m.mesh_key);
				return true;
			});
	}

	const { count: photoCount } = await locals.supabase
		.from('progress_photos')
		.select('id', { count: 'exact', head: true })
		.eq('user_id', userId);

	return {
		profile,
		recentSessions: recentSessions ?? [],
		weekCount: weekCount ?? 0,
		recentMuscles,
		photoCount: photoCount ?? 0
	};
};
