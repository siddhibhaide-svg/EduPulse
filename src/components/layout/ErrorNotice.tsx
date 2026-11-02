import { AlertCircle } from 'lucide-react';

type ErrorNoticeProps = {
  message: string | null;
};

export default function ErrorNotice({ message }: ErrorNoticeProps) {
  if (!message) return null;

  return (
    <p
      role="alert"
      className="mb-4 flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger animate-fade-up"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </p>
  );
}
