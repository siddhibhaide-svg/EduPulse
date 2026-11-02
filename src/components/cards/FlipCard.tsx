type FlipCardProps = {
  question: string;
  answer: string;
  isFlipped: boolean;
  onFlip: () => void;
};

export default function FlipCard({ question, answer, isFlipped, onFlip }: FlipCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={isFlipped ? 'Answer shown. Press to flip back to the question.' : 'Question shown. Press to reveal the answer.'}
      onClick={onFlip}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onFlip();
        }
      }}
      className="h-72 w-full cursor-pointer rounded-2xl [perspective:1400px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:h-80"
    >
      <div
        className={`relative h-full w-full transition-transform duration-500 ease-out [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        <CardFace
          label="Question"
          text={question}
          className="border-obsidian-border bg-gradient-to-br from-[#1A1C24] via-obsidian-surface to-[#121318]"
        />
        <CardFace
          label="Answer"
          text={answer}
          className="border-success/40 bg-gradient-to-br from-[#13261C] via-obsidian-surface to-[#121318] [transform:rotateY(180deg)]"
          labelClassName="text-success"
        />
      </div>
    </div>
  );
}

type CardFaceProps = {
  label: string;
  text: string;
  className: string;
  labelClassName?: string;
};

function CardFace({ label, text, className, labelClassName = 'text-accent-light' }: CardFaceProps) {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl border p-6 shadow-card [backface-visibility:hidden] sm:p-10 ${className}`}
    >
      <span className={`mb-4 text-xs font-semibold uppercase tracking-[0.2em] ${labelClassName}`}>{label}</span>
      <p className="max-h-full w-full overflow-y-auto text-center text-xl font-semibold leading-relaxed text-slate-100 sm:text-2xl">
        {text}
      </p>
    </div>
  );
}
