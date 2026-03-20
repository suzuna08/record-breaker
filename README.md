# Gym Anatomy Tracker

Interactive 3D muscle anatomy explorer, workout logger, and progress photo diary.  
Built with SvelteKit, Tailwind CSS, Supabase, and Threlte-ready architecture.

## Features

- **Anatomy Explorer** — Interactive SVG/3D body map with muscle selection, English + Traditional Chinese labels, and exercise mapping
- **Exercise Library** — Browse, search, and filter exercises with bidirectional muscle ↔ exercise linking
- **Workout Logging** — Create sessions, log sets/reps/weight/RPE, auto-display targeted muscles
- **Progress Photos** — Upload, organize, and timeline progress photos via Supabase Storage
- **Dashboard** — Weekly stats, recent sessions, trained muscle overview
- **Auth** — Supabase Auth with trainee/coach roles
- **Coach-Student Schema** — Database-ready for future coach features

## Tech Stack

| Layer       | Tech                          |
|-------------|-------------------------------|
| Framework   | SvelteKit (TypeScript)        |
| Styling     | Tailwind CSS v4               |
| Database    | Supabase (Postgres + RLS)     |
| Auth        | Supabase Auth                 |
| Storage     | Supabase Storage              |
| 3D (future) | Threlte / Three.js            |
| Deployment  | Vercel                        |

## Getting Started

### Prerequisites

- Node.js >= 18
- A [Supabase](https://supabase.com) project
- (Optional) [Vercel](https://vercel.com) account for deployment

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd record-breaker
npm install
```

### 2. Configure Environment

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find these in your Supabase project dashboard → Settings → API.

### 3. Set Up Database

In the Supabase SQL Editor, run the files in order:

1. **Schema** — `supabase/schema.sql`  
   Creates all tables, indexes, RLS policies, the storage bucket, and the auto-profile trigger.

2. **Seed Data** — `supabase/seed.sql`  
   Inserts 17 muscle groups, 15 exercises, and all exercise ↔ muscle mappings.

### 4. Configure Supabase Auth

In your Supabase dashboard:

1. Go to **Authentication → URL Configuration**
2. Set **Site URL** to `http://localhost:5173` (dev) or your production URL
3. Add `http://localhost:5173/auth/callback` to **Redirect URLs**
4. For production, add `https://your-domain.com/auth/callback`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Project Structure

```
src/
├── app.css                 # Tailwind imports + custom theme
├── app.html                # HTML shell
├── app.d.ts                # App-level TypeScript declarations
├── hooks.server.ts         # Supabase middleware + auth guard
├── lib/
│   ├── components/
│   │   ├── anatomy/        # AnatomySvg, MuscleInfoPanel
│   │   ├── exercises/      # ExerciseCard
│   │   ├── ui/             # Button, Card, FormField, StatsCard, ErrorBanner
│   │   ├── workouts/       # (extensible)
│   │   └── photos/         # (extensible)
│   ├── data/
│   │   └── anatomy.ts      # SVG muscle region map + region colors
│   ├── types/
│   │   └── index.ts        # All TypeScript interfaces
│   ├── stores/             # (extensible for global state)
│   └── utils/              # (extensible)
├── routes/
│   ├── +layout.svelte      # Global layout with nav
│   ├── +layout.ts          # Supabase client init
│   ├── +layout.server.ts   # Server-side session
│   ├── +page.svelte        # Landing page
│   ├── auth/
│   │   ├── signin/         # Sign in page
│   │   ├── signup/         # Sign up page (with role selection)
│   │   ├── signout/        # Sign out action
│   │   └── callback/       # OAuth callback handler
│   ├── dashboard/          # Dashboard with stats + recent muscles
│   ├── anatomy/            # Anatomy Explorer (hero feature)
│   ├── exercises/          # Exercise library + detail pages
│   │   └── [id]/           # Individual exercise detail
│   ├── workouts/           # Workout history
│   │   ├── new/            # New workout form with muscle visualization
│   │   └── [id]/           # Workout session detail
│   ├── photos/             # Progress photo gallery + upload
│   └── profile/            # Profile settings
supabase/
├── schema.sql              # Full DB schema with RLS
└── seed.sql                # Muscle groups, exercises, mappings
```

## Database Schema

| Table                 | Purpose                               |
|-----------------------|---------------------------------------|
| `profiles`            | User profiles with role               |
| `muscle_groups`       | 17 muscles with EN/ZH names + mesh_key|
| `exercise_library`    | 15 exercises with EN/ZH names         |
| `exercise_muscle_map` | Many-to-many exercise ↔ muscle        |
| `workout_sessions`    | Per-user workout sessions             |
| `exercise_logs`       | Sets/reps/weight/RPE per session      |
| `progress_photos`     | Photo metadata + storage path         |
| `coach_student_links` | Future coach-trainee relationships     |

All user data is protected by Row Level Security (RLS).

## Deploying to Vercel

### 1. Connect Repository

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repo
4. Vercel auto-detects SvelteKit

### 2. Set Environment Variables

In your Vercel project settings, add:

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`

### 3. Update Supabase Auth

Add your Vercel production URL to:
- Supabase → Authentication → URL Configuration → Site URL
- Supabase → Authentication → URL Configuration → Redirect URLs  
  (e.g., `https://your-app.vercel.app/auth/callback`)

### 4. Deploy

Vercel will auto-deploy on every push to `main`.

## Upgrading to Real 3D Model

The anatomy system is designed for easy upgrade:

1. **Get a GLB/GLTF model** of human musculature
2. **Name each mesh** using the `mesh_key` values from `muscle_groups` table  
   (e.g., `chest_pectoralis_major`, `leg_quadriceps`)
3. **Replace `AnatomySvg.svelte`** with a Threlte-based component that:
   - Loads the GLB model via `useGltf()`
   - Uses raycasting for hover/click detection
   - Maps each mesh name to the `mesh_key` in the data layer
4. **The rest of the app** (MuscleInfoPanel, exercise mapping, workout visualization) works unchanged

The `@threlte/core` and `@threlte/extras` packages are already installed.

## Assumptions & Notes

- The anatomy view uses an SVG placeholder with positioned ellipses — not medically accurate, but functionally complete for the interaction model
- Traditional Chinese (繁體中文) is used for muscle and exercise names in the UI
- The coach dashboard is schema-ready but UI is deferred to a future iteration
- Progress photos use Supabase Storage with user-scoped folders and RLS
- Dark mode is the default theme; toggle can be added later
- The project uses Svelte 5 runes (`$state`, `$derived`, `$props`)

## License

Private / MIT — your choice.
