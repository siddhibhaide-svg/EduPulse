export type StudySubject = {
  id: string;
  name: string;
  revision_count: number;
};

export type StudyTopic = {
  id: string;
  title: string;
  completed: boolean;
};

export type ExamEntry = {
  id: string;
  name: string;
  exam_date: string;
};

export type StreakState = {
  id: string;
  current_streak: number;
  last_check_in: string | null;
};

export type FocusSession = {
  subject_id: string | null;
  duration_minutes: number;
  completed_at: string;
};

export type RevisionEvent = {
  delta: number;
  created_at: string;
};

export type StudyInsights = {
  subjects: StudySubject[];
  topics: StudyTopic[];
  focusSessions: FocusSession[];
  revisionEvents: RevisionEvent[];
  checkInDates: string[];
  streak: StreakState | null;
  isLoading: boolean;
  error: string | null;
};
