import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LOAD_ERROR_MESSAGE, SAVE_ERROR_MESSAGE } from '@/lib/errors';
import { notifyDataChanged } from '@/lib/dataEvents';
import type { StudySubject } from '@/types/study';

const SUBJECT_COLUMNS = 'id, name, revision_count';

export function useSubjects() {
  const [subjects, setSubjects] = useState<StudySubject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase
      .from('study_subjects')
      .select(SUBJECT_COLUMNS)
      .order('created_at', { ascending: true })
      .then(({ data, error: loadError }) => {
        if (!active) return;
        if (loadError) {
          console.error(loadError);
          setError(LOAD_ERROR_MESSAGE);
        } else {
          setSubjects((data ?? []) as StudySubject[]);
        }
        setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const addSubject = useCallback(async (name: string): Promise<boolean> => {
    setError(null);
    const { data, error: insertError } = await supabase
      .from('study_subjects')
      .insert({ name })
      .select(SUBJECT_COLUMNS)
      .single();
    if (insertError || !data) {
      console.error(insertError);
      setError(SAVE_ERROR_MESSAGE);
      return false;
    }
    setSubjects(prev => [...prev, data as StudySubject]);
    notifyDataChanged();
    return true;
  }, []);

  const adjustRevisions = useCallback(
    async (id: string, delta: number) => {
      const current = subjects.find(subject => subject.id === id);
      if (!current) return;
      const next = Math.max(0, current.revision_count + delta);
      if (next === current.revision_count) return;

      setError(null);
      setSubjects(prev =>
        prev.map(subject => (subject.id === id ? { ...subject, revision_count: next } : subject))
      );
      const { error: updateError } = await supabase
        .from('study_subjects')
        .update({ revision_count: next })
        .eq('id', id);
      if (updateError) {
        console.error(updateError);
        setError(SAVE_ERROR_MESSAGE);
        setSubjects(prev =>
          prev.map(subject =>
            subject.id === id ? { ...subject, revision_count: current.revision_count } : subject
          )
        );
        return;
      }
      const { error: eventError } = await supabase
        .from('revision_events')
        .insert({ subject_id: id, delta: next - current.revision_count });
      if (eventError) console.error(eventError);
      notifyDataChanged();
    },
    [subjects]
  );

  const removeSubject = useCallback(async (id: string) => {
    setError(null);
    const { error: deleteError } = await supabase.from('study_subjects').delete().eq('id', id);
    if (deleteError) {
      console.error(deleteError);
      setError(SAVE_ERROR_MESSAGE);
      return;
    }
    setSubjects(prev => prev.filter(subject => subject.id !== id));
    notifyDataChanged();
  }, []);

  return { subjects, isLoading, error, addSubject, adjustRevisions, removeSubject };
}
