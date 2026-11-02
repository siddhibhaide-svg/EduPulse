import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LOAD_ERROR_MESSAGE } from '@/lib/errors';
import { subscribeToDataChanges } from '@/lib/dataEvents';
import type { FocusSession, RevisionEvent, StreakState, StudyInsights, StudySubject, StudyTopic } from '@/types/study';

type QueryResult<T> = { data: T | null; error: { message: string } | null };

function unwrap<T>(result: QueryResult<T>): T {
  if (result.error) throw result.error;
  return result.data as T;
}

type LoadedInsights = Omit<StudyInsights, 'isLoading' | 'error'>;

async function fetchInsights(): Promise<LoadedInsights> {
  const [subjects, topics, sessions, events, checkIns, streak] = await Promise.all([
    supabase.from('study_subjects').select('id, name, revision_count'),
    supabase.from('study_topics').select('id, title, completed'),
    supabase.from('focus_sessions').select('subject_id, duration_minutes, completed_at'),
    supabase.from('revision_events').select('delta, created_at'),
    supabase.from('streak_check_ins').select('check_in_date'),
    supabase.from('streak_state').select('id, current_streak, last_check_in').limit(1).maybeSingle(),
  ]);

  const checkInRows = unwrap<{ check_in_date: string }[]>(checkIns);
  return {
    subjects: unwrap<StudySubject[]>(subjects),
    topics: unwrap<StudyTopic[]>(topics),
    focusSessions: unwrap<FocusSession[]>(sessions),
    revisionEvents: unwrap<RevisionEvent[]>(events),
    checkInDates: checkInRows.map(row => row.check_in_date),
    streak: unwrap<StreakState | null>(streak),
  };
}

export function useStudyInsights(): StudyInsights {
  const [loaded, setLoaded] = useState<LoadedInsights | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => subscribeToDataChanges(() => setVersion(current => current + 1)), []);

  useEffect(() => {
    let active = true;
    fetchInsights()
      .then(result => {
        if (!active) return;
        setLoaded(result);
        setError(null);
      })
      .catch(loadError => {
        if (!active) return;
        console.error(loadError);
        setError(LOAD_ERROR_MESSAGE);
      });
    return () => {
      active = false;
    };
  }, [version]);

  return {
    subjects: loaded?.subjects ?? [],
    topics: loaded?.topics ?? [],
    focusSessions: loaded?.focusSessions ?? [],
    revisionEvents: loaded?.revisionEvents ?? [],
    checkInDates: loaded?.checkInDates ?? [],
    streak: loaded?.streak ?? null,
    isLoading: loaded === null && error === null,
    error,
  };
}
