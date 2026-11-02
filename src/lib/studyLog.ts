import { supabase } from '@/lib/supabase';
import { notifyDataChanged } from '@/lib/dataEvents';

export async function recordFocusSession(durationMinutes: number, subjectId: string): Promise<boolean> {
  const { error } = await supabase
    .from('focus_sessions')
    .insert({ duration_minutes: durationMinutes, subject_id: subjectId });
  if (error) {
    console.error(error);
    return false;
  }
  notifyDataChanged();
  return true;
}
