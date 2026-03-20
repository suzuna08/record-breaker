import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const supabase = createServerClient(PUBLIC_SUPABASE_URL!, PUBLIC_SUPABASE_ANON_KEY!, {
		cookies: {
			getAll() {
				return cookies.getAll();
			},
			setAll(cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]) {
				cookiesToSet.forEach(({ name, value, options }) =>
					cookies.set(name, value, { ...options, path: '/' } as any)
				);
			}
		}
	});

	const {
		data: { session }
	} = await supabase.auth.getSession();

	return {
		session,
		cookies: cookies.getAll()
	};
};
