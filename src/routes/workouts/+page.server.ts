import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { session } = await locals.safeGetSession();
	if (!session) return { sessions: [] };

	const { data: sessions } = await locals.supabase
		.from('workout_sessions')
		.select('*, exercise_logs(*, exercise:exercise_library(name_en, name_zh))')
		.eq('user_id', session.user.id)
		.order('session_date', { ascending: false })
		.limit(50);

	return { sessions: sessions ?? [] };
};
