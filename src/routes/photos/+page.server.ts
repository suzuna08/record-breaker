import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { session } = await locals.safeGetSession();
	if (!session) return { photos: [] };

	const { data: photos } = await locals.supabase
		.from('progress_photos')
		.select('*')
		.eq('user_id', session.user.id)
		.order('taken_at', { ascending: false });

	const photosWithUrls = await Promise.all(
		(photos ?? []).map(async (photo) => {
			const { data: urlData } = await locals.supabase.storage
				.from('progress-photos')
				.createSignedUrl(photo.image_path, 60 * 60);
			return { ...photo, image_url: urlData?.signedUrl ?? '' };
		})
	);

	return { photos: photosWithUrls };
};
