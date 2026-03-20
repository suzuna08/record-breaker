import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { session } = await locals.safeGetSession();
	if (!session) return { photos: [] };

	const { data: photos } = await locals.supabase
		.from('progress_photos')
		.select('*')
		.eq('user_id', session.user.id)
		.order('taken_at', { ascending: false });

	const photosWithUrls = (photos ?? []).map((photo) => {
		const { data: urlData } = locals.supabase.storage
			.from('progress-photos')
			.getPublicUrl(photo.image_path);
		return { ...photo, image_url: urlData?.publicUrl ?? '' };
	});

	return { photos: photosWithUrls };
};
