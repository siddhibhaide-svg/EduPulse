import { supabase } from '@/lib/supabase';
import { buildDemoDataset, type DemoDataset } from '@/lib/demo/buildDemoDataset';
import { DATA_CLEARED_KEY, clearLocalAppData } from '@/lib/localAppData';

const STUDY_TABLES = [
  'focus_sessions',
  'revision_events',
  'study_topics',
  'exam_countdowns',
  'streak_check_ins',
  'study_subjects',
] as const;

async function insertRows(table: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  const { error } = await supabase.from(table).insert(rows);
  if (error) throw error;
}

async function updateStreakState(values: { current_streak: number; last_check_in: string | null }) {
  const { data: streakRow, error: streakReadError } = await supabase
    .from('streak_state')
    .select('id')
    .limit(1)
    .maybeSingle();
  if (streakReadError) throw streakReadError;
  if (!streakRow) throw new Error('Streak state is missing');

  const { error: streakUpdateError } = await supabase
    .from('streak_state')
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq('id', (streakRow as { id: string }).id);
  if (streakUpdateError) throw streakUpdateError;
}

async function wipeStudyData() {
  for (const table of STUDY_TABLES) {
    const { error } = await supabase.from(table).delete().not('id', 'is', null);
    if (error) throw error;
  }
  await updateStreakState({ current_streak: 0, last_check_in: null });
}

async function seedDemoData(dataset: DemoDataset) {
  const { data: subjectRows, error: subjectError } = await supabase
    .from('study_subjects')
    .insert(dataset.subjects)
    .select('id, name');
  if (subjectError) throw subjectError;

  const subjectIdByName = new Map(
    ((subjectRows ?? []) as { id: string; name: string }[]).map(row => [row.name, row.id]),
  );

  await insertRows('study_topics', dataset.topics);
  await insertRows('exam_countdowns', dataset.exams);
  await insertRows(
    'focus_sessions',
    dataset.focusSessions.map(session => ({
      subject_id: subjectIdByName.get(session.subjectName) ?? null,
      duration_minutes: session.duration_minutes,
      completed_at: session.completed_at,
    })),
  );
  await insertRows(
    'revision_events',
    dataset.revisionEvents.map(event => ({
      subject_id: subjectIdByName.get(event.subjectName) ?? null,
      delta: event.delta,
      created_at: event.created_at,
    })),
  );
  await insertRows(
    'streak_check_ins',
    dataset.checkInDates.map(check_in_date => ({ check_in_date })),
  );
  await updateStreakState({
    current_streak: dataset.streak.current_streak,
    last_check_in: dataset.streak.last_check_in,
  });
}

export async function ensureDemoData(): Promise<void> {
  if (window.localStorage.getItem(DATA_CLEARED_KEY) !== null) return;
  const { count, error } = await supabase
    .from('focus_sessions')
    .select('id', { count: 'exact', head: true });
  if (error) throw error;
  if ((count ?? 0) > 0) return;
  await seedDemoData(buildDemoDataset(new Date()));
}

export async function resetDemoData(): Promise<void> {
  await wipeStudyData();
  clearLocalAppData();
  await seedDemoData(buildDemoDataset(new Date()));
}

export async function clearAllData(): Promise<void> {
  await wipeStudyData();
  clearLocalAppData();
  window.localStorage.setItem(DATA_CLEARED_KEY, 'true');
}
