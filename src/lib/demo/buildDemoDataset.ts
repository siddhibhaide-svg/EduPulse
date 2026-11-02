import { shiftDays, toDateKey } from '@/lib/dates';

export type DemoDataset = {
  subjects: { name: string; revision_count: number }[];
  topics: { title: string; completed: boolean }[];
  exams: { name: string; exam_date: string }[];
  focusSessions: { subjectName: string; duration_minutes: number; completed_at: string }[];
  revisionEvents: { subjectName: string; delta: number; created_at: string }[];
  checkInDates: string[];
  streak: { current_streak: number; last_check_in: string };
};

const SUBJECT_NAMES = ['EM-2', 'OOP Java', 'DE', 'PS', 'OEC'];
// Weighted rotation: EM-2 appears most often, OEC least, so each subject gets a different total.
const SESSION_SUBJECT_ROTATION = [0, 1, 0, 2, 0, 1, 3, 0, 1, 2, 0, 4, 1, 2, 3];
const HISTORY_DAYS = 84;
const REVISION_HISTORY_DAYS = 45;
const STREAK_RUN_DAYS = 9;
const MISSED_DAY = 10;

const DEMO_TOPICS = [
  { title: 'Kinematics', completed: true },
  { title: 'Thermodynamics', completed: true },
  { title: 'Organic Reactions', completed: true },
  { title: 'Electrochemistry', completed: false },
  { title: 'Integral Calculus', completed: true },
  { title: 'Differential Equations', completed: false },
  { title: 'Cell Division', completed: true },
  { title: 'Human Genetics', completed: false },
];

function isStudyDay(daysAgo: number): boolean {
  if (daysAgo <= STREAK_RUN_DAYS) return true;
  if (daysAgo === MISSED_DAY) return false;
  return (daysAgo * 7) % 5 < 3;
}

function atDayTime(now: Date, daysAgo: number, hour: number): string {
  const moment = shiftDays(now, -daysAgo);
  moment.setHours(hour, 0, 0, 0);
  const latest = new Date(now.getTime() - 60_000);
  return (moment > latest ? latest : moment).toISOString();
}

export function buildDemoDataset(now: Date): DemoDataset {
  const focusSessions: DemoDataset['focusSessions'] = [];
  let sessionNumber = 0;
  for (let daysAgo = 0; daysAgo < HISTORY_DAYS; daysAgo++) {
    if (daysAgo > 0 && !isStudyDay(daysAgo)) continue;
    const sessionCount = daysAgo === 0 ? 2 : 1 + (daysAgo % 3);
    for (let index = 0; index < sessionCount; index++) {
      const subjectIndex = SESSION_SUBJECT_ROTATION[sessionNumber % SESSION_SUBJECT_ROTATION.length];
      focusSessions.push({
        subjectName: SUBJECT_NAMES[subjectIndex],
        duration_minutes: sessionNumber % 3 === 0 ? 45 : 25,
        completed_at: atDayTime(now, daysAgo, 8 + index * 4),
      });
      sessionNumber += 1;
    }
  }

  const revisionEvents: DemoDataset['revisionEvents'] = [];
  for (let daysAgo = 0; daysAgo < REVISION_HISTORY_DAYS; daysAgo += 2) {
    revisionEvents.push({
      subjectName: SUBJECT_NAMES[(daysAgo / 2) % SUBJECT_NAMES.length],
      delta: daysAgo % 6 === 0 ? 2 : 1,
      created_at: atDayTime(now, daysAgo, 20),
    });
  }

  const subjects = SUBJECT_NAMES.map(name => ({
    name,
    revision_count: revisionEvents
      .filter(event => event.subjectName === name)
      .reduce((sum, event) => sum + event.delta, 0),
  }));

  const checkInDates: string[] = [];
  for (let daysAgo = 1; daysAgo < HISTORY_DAYS; daysAgo++) {
    if (isStudyDay(daysAgo)) checkInDates.push(toDateKey(shiftDays(now, -daysAgo)));
  }

  return {
    subjects,
    topics: DEMO_TOPICS,
    exams: [
      { name: 'JEE Main', exam_date: toDateKey(shiftDays(now, 42)) },
      { name: 'NEET', exam_date: toDateKey(shiftDays(now, 96)) },
    ],
    focusSessions,
    revisionEvents,
    checkInDates,
    streak: {
      current_streak: STREAK_RUN_DAYS,
      last_check_in: toDateKey(shiftDays(now, -1)),
    },
  };
}
