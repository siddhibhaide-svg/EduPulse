/*
# Add analytics tables and demo data flags

1. New Tables
- `focus_sessions`: one row per completed Pomodoro focus block.
  - `id` (uuid, primary key)
  - `subject_id` (uuid, optional link to a subject; cleared if the subject is deleted)
  - `duration_minutes` (integer, must be positive)
  - `completed_at` (timestamptz)
  - `is_demo` (boolean, true for sample data)
- `revision_events`: a log of every revision counter change, used for the revisions-over-time chart.
  - `id` (uuid, primary key)
  - `subject_id` (uuid, optional link to a subject; cleared if the subject is deleted)
  - `delta` (integer, +1/+2 for additions, -1 for corrections; never zero)
  - `created_at` (timestamptz)
  - `is_demo` (boolean, true for sample data)
- `streak_check_ins`: one row per day the student checked in, used for the streak heatmap.
  - `id` (uuid, primary key)
  - `check_in_date` (date, unique so each day counts once)
  - `created_at` (timestamptz)

2. Modified Tables
- `study_subjects`, `study_topics`, `exam_countdowns`: add `is_demo` (boolean, default false) so sample rows can be reset without touching the student's own entries.

3. Security
- Row level security is enabled on all three new tables.
- The app has no sign-in screen, so policies grant SELECT, INSERT, UPDATE, and DELETE to `anon` and `authenticated`, matching the existing tables.

4. Notes
- Foreign keys use ON DELETE SET NULL so deleting a subject keeps its history.
- All statements are idempotent and safe to re-run.
*/

ALTER TABLE study_subjects ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;
ALTER TABLE study_topics ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;
ALTER TABLE exam_countdowns ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS focus_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid REFERENCES study_subjects(id) ON DELETE SET NULL,
  duration_minutes integer NOT NULL CHECK (duration_minutes > 0),
  completed_at timestamptz NOT NULL DEFAULT now(),
  is_demo boolean NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS focus_sessions_completed_at_idx ON focus_sessions (completed_at);
CREATE INDEX IF NOT EXISTS focus_sessions_subject_id_idx ON focus_sessions (subject_id);

CREATE TABLE IF NOT EXISTS revision_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid REFERENCES study_subjects(id) ON DELETE SET NULL,
  delta integer NOT NULL CHECK (delta <> 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  is_demo boolean NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS revision_events_created_at_idx ON revision_events (created_at);
CREATE INDEX IF NOT EXISTS revision_events_subject_id_idx ON revision_events (subject_id);

CREATE TABLE IF NOT EXISTS streak_check_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  check_in_date date NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE streak_check_ins ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON focus_sessions TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON revision_events TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON streak_check_ins TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_focus_sessions" ON focus_sessions;
CREATE POLICY "anon_select_focus_sessions" ON focus_sessions FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_focus_sessions" ON focus_sessions;
CREATE POLICY "anon_insert_focus_sessions" ON focus_sessions FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_focus_sessions" ON focus_sessions;
CREATE POLICY "anon_update_focus_sessions" ON focus_sessions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_focus_sessions" ON focus_sessions;
CREATE POLICY "anon_delete_focus_sessions" ON focus_sessions FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_revision_events" ON revision_events;
CREATE POLICY "anon_select_revision_events" ON revision_events FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_revision_events" ON revision_events;
CREATE POLICY "anon_insert_revision_events" ON revision_events FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_revision_events" ON revision_events;
CREATE POLICY "anon_update_revision_events" ON revision_events FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_revision_events" ON revision_events;
CREATE POLICY "anon_delete_revision_events" ON revision_events FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_streak_check_ins" ON streak_check_ins;
CREATE POLICY "anon_select_streak_check_ins" ON streak_check_ins FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_streak_check_ins" ON streak_check_ins;
CREATE POLICY "anon_insert_streak_check_ins" ON streak_check_ins FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_streak_check_ins" ON streak_check_ins;
CREATE POLICY "anon_update_streak_check_ins" ON streak_check_ins FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_streak_check_ins" ON streak_check_ins;
CREATE POLICY "anon_delete_streak_check_ins" ON streak_check_ins FOR DELETE
  TO anon, authenticated USING (true);
