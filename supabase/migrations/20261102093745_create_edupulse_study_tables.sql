/*
# EduPulse study tracking tables

1. New Tables
- `study_subjects`: subjects tracked in the Revision Tracker.
  - `id` (uuid, primary key)
  - `name` (text, required)
  - `revision_count` (integer, starts at 0, never negative)
  - `created_at` (timestamptz)
- `study_topics`: topics in the Topic Progress Tracker.
  - `id` (uuid, primary key)
  - `title` (text, required)
  - `completed` (boolean, defaults to false)
  - `created_at` (timestamptz)
- `exam_countdowns`: upcoming exams shown in the Live Exam Countdown.
  - `id` (uuid, primary key)
  - `name` (text, required, e.g. JEE, NEET)
  - `exam_date` (date, required)
  - `created_at` (timestamptz)
- `streak_state`: single-row record of the daily check-in streak.
  - `id` (uuid, primary key)
  - `current_streak` (integer, starts at 0)
  - `last_check_in` (date, nullable until the first check-in)
  - `updated_at` (timestamptz)

2. Security
- Row level security is enabled on all four tables.
- The app has no sign-in screen, so all access runs as the anonymous role. Policies grant SELECT, INSERT, UPDATE, and DELETE to `anon` and `authenticated`.
- Data is intentionally shared across the app with no ownership column.

3. Notes
- A single streak row is seeded so the streak widget always has a record to read and update.
- Counters and streak values are constrained to be non-negative.
*/

CREATE TABLE IF NOT EXISTS study_subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (length(trim(name)) > 0),
  revision_count integer NOT NULL DEFAULT 0 CHECK (revision_count >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS study_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (length(trim(title)) > 0),
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS exam_countdowns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (length(trim(name)) > 0),
  exam_date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS streak_state (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  current_streak integer NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
  last_check_in date,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE study_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_countdowns ENABLE ROW LEVEL SECURITY;
ALTER TABLE streak_state ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON study_subjects TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON study_topics TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON exam_countdowns TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON streak_state TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_study_subjects" ON study_subjects;
CREATE POLICY "anon_select_study_subjects" ON study_subjects FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_study_subjects" ON study_subjects;
CREATE POLICY "anon_insert_study_subjects" ON study_subjects FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_study_subjects" ON study_subjects;
CREATE POLICY "anon_update_study_subjects" ON study_subjects FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_study_subjects" ON study_subjects;
CREATE POLICY "anon_delete_study_subjects" ON study_subjects FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_study_topics" ON study_topics;
CREATE POLICY "anon_select_study_topics" ON study_topics FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_study_topics" ON study_topics;
CREATE POLICY "anon_insert_study_topics" ON study_topics FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_study_topics" ON study_topics;
CREATE POLICY "anon_update_study_topics" ON study_topics FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_study_topics" ON study_topics;
CREATE POLICY "anon_delete_study_topics" ON study_topics FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_exam_countdowns" ON exam_countdowns;
CREATE POLICY "anon_select_exam_countdowns" ON exam_countdowns FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_exam_countdowns" ON exam_countdowns;
CREATE POLICY "anon_insert_exam_countdowns" ON exam_countdowns FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_exam_countdowns" ON exam_countdowns;
CREATE POLICY "anon_update_exam_countdowns" ON exam_countdowns FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_exam_countdowns" ON exam_countdowns;
CREATE POLICY "anon_delete_exam_countdowns" ON exam_countdowns FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_streak_state" ON streak_state;
CREATE POLICY "anon_select_streak_state" ON streak_state FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_streak_state" ON streak_state;
CREATE POLICY "anon_insert_streak_state" ON streak_state FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_streak_state" ON streak_state;
CREATE POLICY "anon_update_streak_state" ON streak_state FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_streak_state" ON streak_state;
CREATE POLICY "anon_delete_streak_state" ON streak_state FOR DELETE
  TO anon, authenticated USING (true);

INSERT INTO streak_state (current_streak, last_check_in)
SELECT 0, NULL
WHERE NOT EXISTS (SELECT 1 FROM streak_state);
