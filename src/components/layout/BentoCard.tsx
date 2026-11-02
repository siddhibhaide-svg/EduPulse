import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type BentoCardProps = {
  title: string;
  icon: LucideIcon;
  action?: ReactNode;
  className?: string;
  active?: boolean;
  children: ReactNode;
};

const ACTIVE_CLASSES =
  'border-accent/60 shadow-[0_0_0_1px_rgba(79,70,229,0.35),0_24px_64px_-20px_rgba(79,70,229,0.6)]';

export default function BentoCard({
  title,
  icon: Icon,
  action,
  className = '',
  active = false,
  children,
}: BentoCardProps) {
  return (
    <section
      className={`animate-fade-up flex flex-col rounded-2xl border bg-gradient-to-br from-[#1A1C24] via-obsidian-surface to-[#121318] p-5 shadow-card transition duration-300 ease-out hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_24px_56px_-24px_rgba(79,70,229,0.55)] sm:p-6 ${
        active ? ACTIVE_CLASSES : 'border-obsidian-border'
      } ${className}`}
    >
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent/30 to-accent/10 text-accent-light ring-1 ring-accent/20">
            <Icon className="h-[18px] w-[18px]" strokeWidth={2.25} />
          </span>
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}
