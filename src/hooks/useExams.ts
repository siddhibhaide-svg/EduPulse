import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LOAD_ERROR_MESSAGE, SAVE_ERROR_MESSAGE } from '@/lib/errors';
import type { ExamEntry } from '@/types/study';

const EXAM_COLUMNS = 'id, name, exam_date';

function byExamDate(a: ExamEntry, b: ExamEntry) {
  return a.exam_date.localeCompare(b.exam_date);
}

export function useExams() {
  const [exams, setExams] = useState<ExamEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase
      .from('exam_countdowns')
      .select(EXAM_COLUMNS)
      .order('exam_date', { ascending: true })
      .then(({ data, error: loadError }) => {
        if (!active) return;
        if (loadError) {
          console.error(loadError);
          setError(LOAD_ERROR_MESSAGE);
        } else {
          setExams((data ?? []) as ExamEntry[]);
        }
        setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const addExam = useCallback(async (name: string, examDate: string): Promise<boolean> => {
    setError(null);
    const { data, error: insertError } = await supabase
      .from('exam_countdowns')
      .insert({ name, exam_date: examDate })
      .select(EXAM_COLUMNS)
      .single();
    if (insertError || !data) {
      console.error(insertError);
      setError(SAVE_ERROR_MESSAGE);
      return false;
    }
    setExams(prev => [...prev, data as ExamEntry].sort(byExamDate));
    return true;
  }, []);

  const removeExam = useCallback(async (id: string) => {
    setError(null);
    const { error: deleteError } = await supabase.from('exam_countdowns').delete().eq('id', id);
    if (deleteError) {
      console.error(deleteError);
      setError(SAVE_ERROR_MESSAGE);
      return;
    }
    setExams(prev => prev.filter(exam => exam.id !== id));
  }, []);

  return { exams, isLoading, error, addExam, removeExam };
}
