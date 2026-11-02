import { parseDateKey, shiftDays, toDateKey } from '@/lib/dates';
import type { FocusSession, RevisionEvent, StreakState, StudySubject } from '@/types/study';

function dayKeysEndingToday(days: number, now: Date): string[] {
  return Array.from({ length: days }, (_, index) => toDateKey(shiftDays(now, index - (days - 1))));
}

function shortLabel(key: string, options: Intl.DateTimeFormatOptions): string {
  return parseDateKey(key).toLocaleDateString('en-US', options);
}

export function sumFocusMinutes(sessions: FocusSession[]): number {
  return sessions.reduce((sum, session) => sum + session.duration_minutes, 0);
}

export function focusMinutesByDay(sessions: FocusSession[], days: number, now: Date) {
  const minutesByKey = new Map<string, number>();
  for (const session of sessions) {
    const key = toDateKey(new Date(session.completed_at));
    minutesByKey.set(key, (minutesByKey.get(key) ?? 0) + session.duration_minutes);
  }
  return dayKeysEndingToday(days, now).map(key => ({
    key,
    label: shortLabel(key, { weekday: 'short' }),
    minutes: minutesByKey.get(key) ?? 0,
  }));
}

export function focusMinutesBySubject(sessions: FocusSession[], subjects: StudySubject[]) {
  const minutesById = new Map<string, number>();
  for (const session of sessions) {
    if (!session.subject_id) continue;
    minutesById.set(session.subject_id, (minutesById.get(session.subject_id) ?? 0) + session.duration_minutes);
  }
  return subjects
    .map(subject => ({ id: subject.id, name: subject.name, minutes: minutesById.get(subject.id) ?? 0 }))
    .filter(slice => slice.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes);
}

export function revisionTrend(events: RevisionEvent[], days: number, now: Date) {
  const keys = dayKeysEndingToday(days, now);
  const windowStart = keys[0];
  const deltaByKey = new Map<string, number>();
  let baseline = 0;
  for (const event of events) {
    const key = toDateKey(new Date(event.created_at));
    if (key < windowStart) {
      baseline += event.delta;
    } else {
      deltaByKey.set(key, (deltaByKey.get(key) ?? 0) + event.delta);
    }
  }
  let running = baseline;
  return keys.map(key => {
    running += deltaByKey.get(key) ?? 0;
    return { key, label: shortLabel(key, { month: 'short', day: 'numeric' }), total: running };
  });
}

export function heatmapCells(checkInDates: string[], days: number, now: Date) {
  const checked = new Set(checkInDates);
  const todayKey = toDateKey(now);
  return dayKeysEndingToday(days, now).map(key => ({
    key,
    label: shortLabel(key, { month: 'short', day: 'numeric' }),
    checked: checked.has(key),
    isToday: key === todayKey,
  }));
}

export function getLongestStreak(checkInDates: string[]): number {
  const sorted = [...new Set(checkInDates)].sort();
  let longest = 0;
  let run = 0;
  let previousKey: string | null = null;
  for (const key of sorted) {
    const followsPrevious = previousKey !== null && toDateKey(shiftDays(parseDateKey(previousKey), 1)) === key;
    run = followsPrevious ? run + 1 : 1;
    longest = Math.max(longest, run);
    previousKey = key;
  }
  return longest;
}

export function getActiveStreak(streak: StreakState | null, now: Date) {
  const todayKey = toDateKey(now);
  const yesterdayKey = toDateKey(shiftDays(now, -1));
  const checkedInToday = streak?.last_check_in === todayKey;
  const isActive = checkedInToday || streak?.last_check_in === yesterdayKey;
  return {
    todayKey,
    yesterdayKey,
    checkedInToday: Boolean(checkedInToday),
    currentStreak: streak && isActive ? streak.current_streak : 0,
  };
}
