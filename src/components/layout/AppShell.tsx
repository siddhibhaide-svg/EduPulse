import type { ReactNode } from 'react';
import { Activity } from 'lucide-react';
import { NAV_ITEMS, type AppView } from '@/lib/navigation';

type AppShellProps = {
  view: AppView;
  onNavigate: (view: AppView) => void;
  children: ReactNode;
};

export default function AppShell({ view, onNavigate, children }: AppShellProps) {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-20 flex-col border-r border-obsidian-border bg-obsidian-canvas/90 backdrop-blur-xl md:flex lg:w-64">
        <div className="flex h-20 items-center justify-center px-4 lg:justify-start lg:px-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-light/90 to-accent">
            <Activity className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="ml-3 hidden text-lg font-bold tracking-tight lg:inline">EduPulse</span>
        </div>
        <nav aria-label="Main navigation" className="flex flex-col gap-1.5 px-3 py-4">
          {NAV_ITEMS.map(item => {
            const isActive = item.view === view;
            return (
              <button
                key={item.view}
                type="button"
                onClick={() => onNavigate(item.view)}
                aria-current={isActive ? 'page' : undefined}
                title={item.label}
                className={`group flex min-h-[44px] items-center justify-center gap-3 rounded-xl px-3 text-sm font-semibold transition lg:justify-start lg:px-4 ${
                  isActive
                    ? 'bg-accent/15 text-white shadow-glow ring-1 ring-accent/50'
                    : 'text-slate-400 hover:bg-obsidian-raised hover:text-slate-100'
                }`}
              >
                <item.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-accent-light' : ''}`} />
                <span className="sr-only lg:not-sr-only">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="md:pl-20 lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 md:pb-16 lg:px-8 lg:pt-10">{children}</div>
      </div>

      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-obsidian-border bg-obsidian-canvas/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1 px-2 py-2">
          {NAV_ITEMS.map(item => {
            const isActive = item.view === view;
            return (
              <button
                key={item.view}
                type="button"
                onClick={() => onNavigate(item.view)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-semibold transition active:scale-95 ${
                  isActive ? 'bg-accent/15 text-white' : 'text-slate-400'
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-accent-light' : ''}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
