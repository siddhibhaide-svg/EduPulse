import ErrorNotice from '@/components/layout/ErrorNotice';
import StatCards from '@/components/dashboard/StatCards';
import FocusBarChart from '@/components/charts/FocusBarChart';
import RevisionLineChart from '@/components/charts/RevisionLineChart';
import StreakHeatmap from '@/components/charts/StreakHeatmap';
import SubjectDonutChart from '@/components/charts/SubjectDonutChart';
import ExamCountdown from '@/components/widgets/ExamCountdown';
import FocusTimer from '@/components/widgets/FocusTimer';
import RevisionTracker from '@/components/widgets/RevisionTracker';
import StreakCounter from '@/components/widgets/StreakCounter';
import TopicProgress from '@/components/widgets/TopicProgress';
import { useStudyInsights } from '@/hooks/useStudyInsights';

export default function Dashboard() {
  const insights = useStudyInsights();
  const { isLoading, error, subjects, focusSessions, revisionEvents, checkInDates } = insights;

  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      <ErrorNotice message={error} />
      <StatCards insights={insights} />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12 lg:gap-6">
        <ExamCountdown />
        <FocusTimer subjects={subjects} />
        <StreakCounter />
        <FocusBarChart sessions={focusSessions} isLoading={isLoading} />
        <SubjectDonutChart sessions={focusSessions} subjects={subjects} isLoading={isLoading} />
        <RevisionTracker />
        <RevisionLineChart events={revisionEvents} isLoading={isLoading} />
        <TopicProgress />
        <StreakHeatmap checkInDates={checkInDates} isLoading={isLoading} />
      </div>
    </div>
  );
}
