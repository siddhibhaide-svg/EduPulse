import { BookOpen, Brain, Columns3, Lightbulb, Network, Repeat, Sparkles, Timer, type LucideIcon } from 'lucide-react';
import BentoCard from '@/components/layout/BentoCard';
import PageHeader from '@/components/layout/PageHeader';
import { STUDY_METHODS, type StudyMethod } from '@/lib/studyMethods';

const METHOD_ICONS: Record<StudyMethod['icon'], LucideIcon> = {
  timer: Timer,
  lightbulb: Lightbulb,
  brain: Brain,
  repeat: Repeat,
  network: Network,
  book: BookOpen,
  sparkles: Sparkles,
  columns: Columns3,
};

export default function StudyMethodsPage() {
  return (
    <div>
      <PageHeader
        title="Study Methods"
        description="Proven techniques you can use with the rest of EduPulse. Pick one that fits the task in front of you."
      />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 lg:gap-6">
        {STUDY_METHODS.map(method => (
          <BentoCard
            key={method.id}
            title={method.name}
            icon={METHOD_ICONS[method.icon]}
            className="h-full transition-colors hover:-translate-y-1"
          >
            <div className="flex flex-1 flex-col gap-5">
              <p className="text-sm leading-relaxed text-slate-300">{method.description}</p>
              <ol className="flex flex-col gap-3">
                {method.steps.map((step, stepIndex) => (
                  <li key={step} className="flex gap-3 text-sm leading-relaxed text-slate-400">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-obsidian-canvas font-mono text-xs font-semibold text-accent-light ring-1 ring-obsidian-border">
                      {stepIndex + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-obsidian-border pt-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Best for</span>
                <span className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                  {method.bestFor}
                </span>
              </div>
            </div>
          </BentoCard>
        ))}
      </div>
    </div>
  );
}
