-- =============================================================
-- Seed Data — Muscle Groups
-- =============================================================

insert into public.muscle_groups (name_en, name_zh, region, description, mesh_key) values
  ('Pectoralis Major', '胸大肌', 'chest', 'Large fan-shaped muscle of the chest responsible for arm adduction, flexion, and internal rotation.', 'chest_pectoralis_major'),
  ('Anterior Deltoid', '三角肌前束', 'shoulders', 'Front portion of the deltoid; involved in shoulder flexion and pressing movements.', 'shoulder_anterior_deltoid'),
  ('Lateral Deltoid', '三角肌中束', 'shoulders', 'Middle portion of the deltoid; primary mover for shoulder abduction.', 'shoulder_lateral_deltoid'),
  ('Posterior Deltoid', '三角肌後束', 'shoulders', 'Rear portion of the deltoid; assists in shoulder extension and external rotation.', 'shoulder_posterior_deltoid'),
  ('Latissimus Dorsi', '闊背肌', 'back', 'Large muscle of the back responsible for shoulder extension, adduction, and internal rotation.', 'back_latissimus_dorsi'),
  ('Trapezius', '斜方肌', 'back', 'Large triangular muscle spanning the upper back and neck; controls scapular movement.', 'back_trapezius'),
  ('Rhomboids', '菱形肌', 'back', 'Deep muscles between the spine and scapula; retract and stabilize the shoulder blade.', 'back_rhomboids'),
  ('Biceps Brachii', '肱二頭肌', 'arms', 'Two-headed muscle of the upper arm; flexes the elbow and supinates the forearm.', 'arm_biceps'),
  ('Triceps Brachii', '肱三頭肌', 'arms', 'Three-headed muscle on the back of the upper arm; extends the elbow.', 'arm_triceps'),
  ('Rectus Abdominis', '腹直肌', 'core', 'Paired muscle running vertically along the abdomen; flexes the trunk.', 'core_rectus_abdominis'),
  ('Obliques', '腹斜肌', 'core', 'Lateral abdominal muscles involved in trunk rotation and lateral flexion.', 'core_obliques'),
  ('Erector Spinae', '豎脊肌', 'back', 'Group of muscles along the spine that extend and laterally flex the trunk.', 'back_erector_spinae'),
  ('Gluteus Maximus', '臀大肌', 'legs', 'Largest muscle of the buttocks; primary hip extensor.', 'leg_glutes'),
  ('Quadriceps', '股四頭肌', 'legs', 'Four-headed muscle group on the front of the thigh; extends the knee.', 'leg_quadriceps'),
  ('Hamstrings', '腿後肌群', 'legs', 'Three muscles on the back of the thigh; flex the knee and extend the hip.', 'leg_hamstrings'),
  ('Calves (Gastrocnemius)', '小腿肌（腓腸肌）', 'legs', 'Two-headed muscle of the lower leg; plantar flexes the ankle.', 'leg_calves'),
  ('Forearms', '前臂肌群', 'arms', 'Muscle group controlling wrist and finger movements; grip strength.', 'arm_forearms');


-- =============================================================
-- Seed Data — Exercises
-- =============================================================

insert into public.exercise_library (name_en, name_zh, equipment, category, instructions) values
  ('Back Squat', '槓鈴深蹲', 'barbell', 'compound', 'Place barbell on upper traps. Squat until thighs are parallel. Drive through heels to stand.'),
  ('Front Squat', '前蹲舉', 'barbell', 'compound', 'Rack barbell across front deltoids. Squat with upright torso. Keep elbows high throughout.'),
  ('Bulgarian Split Squat', '保加利亞分腿蹲', 'dumbbell', 'compound', 'Rear foot elevated on bench. Lower until front thigh is parallel. Drive up through front heel.'),
  ('Romanian Deadlift', '羅馬尼亞硬舉', 'barbell', 'compound', 'Hold barbell at hip level. Hinge at hips with slight knee bend. Lower until hamstring stretch, then return.'),
  ('Conventional Deadlift', '傳統硬舉', 'barbell', 'compound', 'Stand with feet hip-width, grip bar outside knees. Drive through floor keeping bar close to body.'),
  ('Bench Press', '槓鈴臥推', 'barbell', 'compound', 'Lie on bench, grip bar slightly wider than shoulders. Lower to chest, press back up.'),
  ('Incline Dumbbell Press', '上斜啞鈴臥推', 'dumbbell', 'compound', 'Set bench to 30-45°. Press dumbbells from chest level to overhead with controlled motion.'),
  ('Shoulder Press', '肩推', 'barbell', 'compound', 'Press barbell overhead from shoulders. Keep core braced and avoid excessive back arch.'),
  ('Lateral Raise', '側平舉', 'dumbbell', 'isolation', 'Raise dumbbells laterally to shoulder height with slight elbow bend. Lower with control.'),
  ('Pull-up', '引體向上', 'bodyweight', 'compound', 'Hang from bar with overhand grip. Pull chin above bar. Lower with control.'),
  ('Lat Pulldown', '滑輪下拉', 'cable', 'compound', 'Grip bar wider than shoulders. Pull to upper chest while squeezing lats. Return with control.'),
  ('Barbell Row', '槓鈴划船', 'barbell', 'compound', 'Hinge at hips, grip bar with overhand grip. Row to lower chest/upper abdomen. Lower with control.'),
  ('Seated Cable Row', '坐姿繩索划船', 'cable', 'compound', 'Sit with feet braced. Pull handle to lower chest while squeezing shoulder blades. Return with control.'),
  ('Bicep Curl', '肱二頭彎舉', 'dumbbell', 'isolation', 'Stand with dumbbells at sides. Curl weights by flexing elbows. Lower with control.'),
  ('Tricep Pushdown', '三頭肌下壓', 'cable', 'isolation', 'Stand facing cable machine. Push handle down by extending elbows. Return with control.');


-- =============================================================
-- Seed Data — Exercise ↔ Muscle Mapping
-- =============================================================

-- Helper: we reference exercises and muscles by name for clarity.

-- Back Squat → primary: quads, glutes | secondary: hamstrings, core, erector
insert into public.exercise_muscle_map (exercise_id, muscle_id, role)
select e.id, m.id, 'primary'
from public.exercise_library e, public.muscle_groups m
where e.name_en = 'Back Squat' and m.mesh_key in ('leg_quadriceps', 'leg_glutes');

insert into public.exercise_muscle_map (exercise_id, muscle_id, role)
select e.id, m.id, 'secondary'
from public.exercise_library e, public.muscle_groups m
where e.name_en = 'Back Squat' and m.mesh_key in ('leg_hamstrings', 'core_rectus_abdominis', 'back_erector_spinae');

-- Front Squat → primary: quads | secondary: glutes, core
insert into public.exercise_muscle_map (exercise_id, muscle_id, role)
select e.id, m.id, 'primary'
from public.exercise_library e, public.muscle_groups m
where e.name_en = 'Front Squat' and m.mesh_key in ('leg_quadriceps');

insert into public.exercise_muscle_map (exercise_id, muscle_id, role)
select e.id, m.id, 'secondary'
from public.exercise_library e, public.muscle_groups m
where e.name_en = 'Front Squat' and m.mesh_key in ('leg_glutes', 'core_rectus_abdominis');

-- Bulgarian Split Squat → primary: quads, glutes | secondary: hamstrings
insert into public.exercise_muscle_map (exercise_id, muscle_id, role)
select e.id, m.id, 'primary'
from public.exercise_library e, public.muscle_groups m
where e.name_en = 'Bulgarian Split Squat' and m.mesh_key in ('leg_quadriceps', 'leg_glutes');

insert into public.exercise_muscle_map (exercise_id, muscle_id, role)
select e.id, m.id, 'secondary'
from public.exercise_library e, public.muscle_groups m
where e.name_en = 'Bulgarian Split Squat' and m.mesh_key in ('leg_hamstrings');

-- Romanian Deadlift → primary: hamstrings, glutes | secondary: erector, forearms
insert into public.exercise_muscle_map (exercise_id, muscle_id, role)
select e.id, m.id, 'primary'
from public.exercise_library e, public.muscle_groups m
where e.name_en = 'Romanian Deadlift' and m.mesh_key in ('leg_hamstrings', 'leg_glutes');

insert into public.exercise_muscle_map (exercise_id, muscle_id, role)
select e.id, m.id, 'secondary'
from public.exercise_library e, public.muscle_groups m
where e.name_en = 'Romanian Deadlift' and m.mesh_key in ('back_erector_spinae', 'arm_forearms');

-- Conventional Deadlift → primary: glutes, hamstrings, erector | secondary: quads, traps, forearms
insert into public.exercise_muscle_map (exercise_id, muscle_id, role)
select e.id, m.id, 'primary'
from public.exercise_library e, public.muscle_groups m
where e.name_en = 'Conventional Deadlift' and m.mesh_key in ('leg_glutes', 'leg_hamstrings', 'back_erector_spinae');

insert into public.exercise_muscle_map (exercise_id, muscle_id, role)
select e.id, m.id, 'secondary'
from public.exercise_library e, public.muscle_groups m
where e.name_en = 'Conventional Deadlift' and m.mesh_key in ('leg_quadriceps', 'back_trapezius', 'arm_forearms');

-- Bench Press → primary: chest | secondary: anterior deltoid, triceps
insert into public.exercise_muscle_map (exercise_id, muscle_id, role)
select e.id, m.id, 'primary'
from public.exercise_library e, public.muscle_groups m
where e.name_en = 'Bench Press' and m.mesh_key in ('chest_pectoralis_major');

insert into public.exercise_muscle_map (exercise_id, muscle_id, role)
select e.id, m.id, 'secondary'
from public.exercise_library e, public.muscle_groups m
where e.name_en = 'Bench Press' and m.mesh_key in ('shoulder_anterior_deltoid', 'arm_triceps');

-- Incline Dumbbell Press → primary: chest, anterior deltoid | secondary: triceps
insert into public.exercise_muscle_map (exercise_id, muscle_id, role)
select e.id, m.id, 'primary'
from public.exercise_library e, public.muscle_groups m
where e.name_en = 'Incline Dumbbell Press' and m.mesh_key in ('chest_pectoralis_major', 'shoulder_anterior_deltoid');

insert into public.exercise_muscle_map (exercise_id, muscle_id, role)
select e.id, m.id, 'secondary'
from public.exercise_library e, public.muscle_groups m
where e.name_en = 'Incline Dumbbell Press' and m.mesh_key in ('arm_triceps');

-- Shoulder Press → primary: anterior deltoid, lateral deltoid | secondary: triceps, traps
insert into public.exercise_muscle_map (exercise_id, muscle_id, role)
select e.id, m.id, 'primary'
from public.exercise_library e, public.muscle_groups m
where e.name_en = 'Shoulder Press' and m.mesh_key in ('shoulder_anterior_deltoid', 'shoulder_lateral_deltoid');

insert into public.exercise_muscle_map (exercise_id, muscle_id, role)
select e.id, m.id, 'secondary'
from public.exercise_library e, public.muscle_groups m
where e.name_en = 'Shoulder Press' and m.mesh_key in ('arm_triceps', 'back_trapezius');

-- Lateral Raise → primary: lateral deltoid | secondary: anterior deltoid, traps
insert into public.exercise_muscle_map (exercise_id, muscle_id, role)
select e.id, m.id, 'primary'
from public.exercise_library e, public.muscle_groups m
where e.name_en = 'Lateral Raise' and m.mesh_key in ('shoulder_lateral_deltoid');

insert into public.exercise_muscle_map (exercise_id, muscle_id, role)
select e.id, m.id, 'secondary'
from public.exercise_library e, public.muscle_groups m
where e.name_en = 'Lateral Raise' and m.mesh_key in ('shoulder_anterior_deltoid', 'back_trapezius');

-- Pull-up → primary: lats, biceps | secondary: rhomboids, posterior deltoid, forearms
insert into public.exercise_muscle_map (exercise_id, muscle_id, role)
select e.id, m.id, 'primary'
from public.exercise_library e, public.muscle_groups m
where e.name_en = 'Pull-up' and m.mesh_key in ('back_latissimus_dorsi', 'arm_biceps');

insert into public.exercise_muscle_map (exercise_id, muscle_id, role)
select e.id, m.id, 'secondary'
from public.exercise_library e, public.muscle_groups m
where e.name_en = 'Pull-up' and m.mesh_key in ('back_rhomboids', 'shoulder_posterior_deltoid', 'arm_forearms');

-- Lat Pulldown → primary: lats | secondary: biceps, rhomboids, posterior deltoid
insert into public.exercise_muscle_map (exercise_id, muscle_id, role)
select e.id, m.id, 'primary'
from public.exercise_library e, public.muscle_groups m
where e.name_en = 'Lat Pulldown' and m.mesh_key in ('back_latissimus_dorsi');

insert into public.exercise_muscle_map (exercise_id, muscle_id, role)
select e.id, m.id, 'secondary'
from public.exercise_library e, public.muscle_groups m
where e.name_en = 'Lat Pulldown' and m.mesh_key in ('arm_biceps', 'back_rhomboids', 'shoulder_posterior_deltoid');

-- Barbell Row → primary: lats, rhomboids | secondary: biceps, posterior deltoid, traps, erector
insert into public.exercise_muscle_map (exercise_id, muscle_id, role)
select e.id, m.id, 'primary'
from public.exercise_library e, public.muscle_groups m
where e.name_en = 'Barbell Row' and m.mesh_key in ('back_latissimus_dorsi', 'back_rhomboids');

insert into public.exercise_muscle_map (exercise_id, muscle_id, role)
select e.id, m.id, 'secondary'
from public.exercise_library e, public.muscle_groups m
where e.name_en = 'Barbell Row' and m.mesh_key in ('arm_biceps', 'shoulder_posterior_deltoid', 'back_trapezius', 'back_erector_spinae');

-- Seated Cable Row → primary: lats, rhomboids | secondary: biceps, traps
insert into public.exercise_muscle_map (exercise_id, muscle_id, role)
select e.id, m.id, 'primary'
from public.exercise_library e, public.muscle_groups m
where e.name_en = 'Seated Cable Row' and m.mesh_key in ('back_latissimus_dorsi', 'back_rhomboids');

insert into public.exercise_muscle_map (exercise_id, muscle_id, role)
select e.id, m.id, 'secondary'
from public.exercise_library e, public.muscle_groups m
where e.name_en = 'Seated Cable Row' and m.mesh_key in ('arm_biceps', 'back_trapezius');

-- Bicep Curl → primary: biceps | secondary: forearms
insert into public.exercise_muscle_map (exercise_id, muscle_id, role)
select e.id, m.id, 'primary'
from public.exercise_library e, public.muscle_groups m
where e.name_en = 'Bicep Curl' and m.mesh_key in ('arm_biceps');

insert into public.exercise_muscle_map (exercise_id, muscle_id, role)
select e.id, m.id, 'secondary'
from public.exercise_library e, public.muscle_groups m
where e.name_en = 'Bicep Curl' and m.mesh_key in ('arm_forearms');

-- Tricep Pushdown → primary: triceps
insert into public.exercise_muscle_map (exercise_id, muscle_id, role)
select e.id, m.id, 'primary'
from public.exercise_library e, public.muscle_groups m
where e.name_en = 'Tricep Pushdown' and m.mesh_key in ('arm_triceps');
