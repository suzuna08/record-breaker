export type UserRole = 'trainee' | 'coach';

export interface Profile {
	id: string;
	email: string;
	role: UserRole;
	display_name: string | null;
	created_at: string;
}

export interface MuscleGroup {
	id: string;
	name_en: string;
	name_zh: string;
	region: string;
	description: string;
	mesh_key: string;
	created_at: string;
}

export interface Exercise {
	id: string;
	name_en: string;
	name_zh: string;
	equipment: string;
	category: string;
	instructions: string;
	created_at: string;
}

export interface ExerciseMuscleMap {
	id: string;
	exercise_id: string;
	muscle_id: string;
	role: 'primary' | 'secondary';
	weight_score: number | null;
	created_at: string;
}

export interface ExerciseWithMuscles extends Exercise {
	primary_muscles: MuscleGroup[];
	secondary_muscles: MuscleGroup[];
}

export interface MuscleWithExercises extends MuscleGroup {
	exercises: (Exercise & { role: 'primary' | 'secondary' })[];
}

export interface WorkoutSession {
	id: string;
	user_id: string;
	session_date: string;
	title: string;
	note: string | null;
	created_at: string;
}

export interface ExerciseLog {
	id: string;
	session_id: string;
	exercise_id: string;
	sets: number;
	reps: number;
	weight: number;
	rpe: number | null;
	note: string | null;
	created_at: string;
	exercise?: Exercise;
}

export interface WorkoutSessionWithLogs extends WorkoutSession {
	exercise_logs: ExerciseLog[];
}

export interface ProgressPhoto {
	id: string;
	user_id: string;
	image_path: string;
	shot_type: 'front' | 'back' | 'side' | 'custom';
	taken_at: string;
	note: string | null;
	created_at: string;
	image_url?: string;
}

export interface CoachStudentLink {
	id: string;
	coach_id: string;
	trainee_id: string;
	status: 'pending' | 'active' | 'inactive';
	created_at: string;
}
