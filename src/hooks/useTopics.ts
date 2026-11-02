import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LOAD_ERROR_MESSAGE, SAVE_ERROR_MESSAGE } from '@/lib/errors';
import { notifyDataChanged } from '@/lib/dataEvents';
import type { StudyTopic } from '@/types/study';

const TOPIC_COLUMNS = 'id, title, completed';

export function useTopics() {
  const [topics, setTopics] = useState<StudyTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase
      .from('study_topics')
      .select(TOPIC_COLUMNS)
      .order('created_at', { ascending: true })
      .then(({ data, error: loadError }) => {
        if (!active) return;
        if (loadError) {
          console.error(loadError);
          setError(LOAD_ERROR_MESSAGE);
        } else {
          setTopics((data ?? []) as StudyTopic[]);
        }
        setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const addTopic = useCallback(async (title: string): Promise<boolean> => {
    setError(null);
    const { data, error: insertError } = await supabase
      .from('study_topics')
      .insert({ title })
      .select(TOPIC_COLUMNS)
      .single();
    if (insertError || !data) {
      console.error(insertError);
      setError(SAVE_ERROR_MESSAGE);
      return false;
    }
    setTopics(prev => [...prev, data as StudyTopic]);
    notifyDataChanged();
    return true;
  }, []);

  const toggleTopic = useCallback(
    async (id: string) => {
      const current = topics.find(topic => topic.id === id);
      if (!current) return;
      const next = !current.completed;

      setError(null);
      setTopics(prev => prev.map(topic => (topic.id === id ? { ...topic, completed: next } : topic)));
      const { error: updateError } = await supabase
        .from('study_topics')
        .update({ completed: next })
        .eq('id', id);
      if (updateError) {
        console.error(updateError);
        setError(SAVE_ERROR_MESSAGE);
        setTopics(prev =>
          prev.map(topic => (topic.id === id ? { ...topic, completed: current.completed } : topic))
        );
        return;
      }
      notifyDataChanged();
    },
    [topics]
  );

  const removeTopic = useCallback(async (id: string) => {
    setError(null);
    const { error: deleteError } = await supabase.from('study_topics').delete().eq('id', id);
    if (deleteError) {
      console.error(deleteError);
      setError(SAVE_ERROR_MESSAGE);
      return;
    }
    setTopics(prev => prev.filter(topic => topic.id !== id));
    notifyDataChanged();
  }, []);

  return { topics, isLoading, error, addTopic, toggleTopic, removeTopic };
}
