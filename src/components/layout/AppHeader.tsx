import { Activity } from 'lucide-react';
import ClearAllDataControl from '@/components/layout/ClearAllDataControl';
import DemoDataControl from '@/components/layout/DemoDataControl';

type AppHeaderProps = {
  isReady: boolean;
  onResetDemo: () => Promise<void>;
  onClearAll: () => Promise<void>;
};

export default function AppHeader({ isReady, onResetDemo, onClearAll }: AppHeaderProps) {
  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="animate-fade-up flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-light/90 to-accent shadow-[0_8px_24px_-8px_rgba(79,70,229,0.8)]">
          <Activity className="h-6 w-6 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="bg-gradient-to-r from-white via-white to-accent-light bg-clip-text text-2xl font-bold tracking-tight text-transparent">
            EduPulse
          </h1>
          <p className="text-sm text-slate-400">Study Companion &amp; Tracking Hub</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <p className="inline-flex w-fit items-center gap-2.5 rounded-full border border-obsidian-border bg-obsidian-surface px-4 py-2 text-sm text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          {todayLabel}
        </p>
        <DemoDataControl onReset={onResetDemo} disabled={!isReady} />
        <ClearAllDataControl onClear={onClearAll} disabled={!isReady} />
      </div>
    </header>
  );
}
