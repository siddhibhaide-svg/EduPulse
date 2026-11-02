import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LOAD_ERROR_MESSAGE, SAVE_ERROR_MESSAGE } from '@/lib/errors';
import { notifyDataChanged } from '@/lib/dataEvents';
import { getActiveStreak } from '@/lib/analytics';
import type { StreakState } from '@/types/study';

export function useStreak() {
  const [streak, setStreak] = useState<StreakState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase
      .from('streak_state')
      .select('id, current_streak, last_check_in')
      .limit(1)
      .maybeSingle()
      .then(({ data, error: loadError }) => {
        if (!active) return;
        if (loadError || !data) {
          console.error(loadError ?? 'Streak record not found');
          setError(LOAD_ERROR_MESSAGE);
        } else {
          setStreak(data as StreakState);
        }
        setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const { currentStreak, checkedInToday, todayKey, yesterdayKey } = getActiveStreak(streak, new Date());

  const checkIn = useCallback(async () => {
    if (!streak || streak.last_check_in === todayKey) return;
    const nextStreak = streak.last_check_in === yesterdayKey ? streak.current_streak + 1 : 1;
    const previous = streak;

    setError(null);
    setStreak({ ...streak, current_streak: nextStreak, last_check_in: todayKey });
    const { error: checkInError } = await supabase
      .from('streak_check_ins')
      .upsert({ check_in_date: todayKey }, { onConflict: 'check_in_date', ignoreDuplicates: true });
    const { error: updateError } = checkInError
      ? { error: checkInError }
      : await supabase
          .from('streak_state')
          .update({
            current_streak: nextStreak,
            last_check_in: todayKey,
            updated_at: new Date().toISOString(),
          })
          .eq('id', streak.id);
    if (updateError) {
      console.error(updateError);
      setError(SAVE_ERROR_MESSAGE);
      setStreak(previous);
      return;
    }
    notifyDataChanged();
  }, [streak, todayKey, yesterdayKey]);

  return { streak, currentStreak, checkedInToday, isLoading, error, checkIn };
}
