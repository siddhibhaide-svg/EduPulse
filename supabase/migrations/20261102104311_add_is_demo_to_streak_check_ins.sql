/*
# Mark demo streak check-ins so reset only removes demo data

1. Modified Tables
- `streak_check_ins`: new column `is_demo` (boolean, not null, default false).
- Existing check-in rows are marked as demo, because they were created by the demo data seeder.

2. Security
- No change to RLS policies or grants. Existing anon and authenticated policies still apply.

3. Important Notes
- New check-ins made by the user default to is_demo = false, so "Reset demo data" will no longer remove them.
*/

ALTER TABLE streak_check_ins ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;

UPDATE streak_check_ins SET is_demo = true WHERE is_demo = false;
