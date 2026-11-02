import type { ReactNode } from 'react';
import type { OnePageNotes } from '@/types/notes';

type OnePageNotesSheetProps = {
  title: string;
  notes: OnePageNotes;
};

export default function OnePageNotesSheet({ title, notes }: OnePageNotesSheetProps) {
  return (
    <article
      id="one-page-notes"
      className="mx-auto w-full max-w-[210mm] rounded-lg bg-white p-6 text-slate-900 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] sm:p-10 md:min-h-[297mm]"
    >
      <header className="border-b-2 border-slate-900 pb-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          EduPulse One-Page Notes
        </p>
        <h2 className="mt-1 text-2xl font-bold leading-tight break-words">{title}</h2>
      </header>

      <Section title="Key Points">
        {notes.keyPoints.length === 0 ? (
          <EmptyLine />
        ) : (
          <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed">
            {notes.keyPoints.map(point => (
              <li key={point}>{point}</li>
            ))}
          </ol>
        )}
      </Section>

      <Section title="Formulas">
        {notes.formulas.length === 0 ? (
          <EmptyLine />
        ) : (
          <ul className="space-y-2">
            {notes.formulas.map(formula => (
              <li key={formula} className="rounded-md bg-slate-100 px-3 py-2 font-mono text-sm break-words">
                {formula}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Definitions">
        {notes.definitions.length === 0 ? (
          <EmptyLine />
        ) : (
          <dl className="space-y-3 text-sm leading-relaxed">
            {notes.definitions.map(definition => (
              <div key={definition.term}>
                <dt className="font-bold">{definition.term}</dt>
                <dd className="text-slate-700">{definition.meaning}</dd>
              </div>
            ))}
          </dl>
        )}
      </Section>

      <Section title="Revision Questions">
        <ol className="list-decimal space-y-2.5 pl-5 text-sm leading-relaxed">
          {notes.questions.map(item => (
            <li key={item.question}>{item.question}</li>
          ))}
        </ol>
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6">
      <h3 className="mb-3 border-b border-slate-300 pb-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-600">
        {title}
      </h3>
      {children}
    </section>
  );
}

function EmptyLine() {
  return <p className="text-sm italic text-slate-500">None detected in this text.</p>;
}
