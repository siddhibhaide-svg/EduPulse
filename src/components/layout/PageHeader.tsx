import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export default function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <header className="animate-fade-up mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:mb-8">
      <div>
        <h1 className="bg-gradient-to-r from-white via-white to-accent-light bg-clip-text text-3xl font-bold tracking-tight text-transparent">
          {title}
        </h1>
        <p className="mt-1.5 text-sm text-slate-400">{description}</p>
      </div>
      {action}
    </header>
  );
}
