import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

type ResetStage = 'idle' | 'confirm' | 'resetting' | 'error';

type DemoDataControlProps = {
  onReset: () => Promise<void>;
  disabled: boolean;
};

const LABELS: Record<ResetStage, string> = {
  idle: 'Reset demo data',
  confirm: 'Click again to confirm',
  resetting: 'Resetting...',
  error: 'Reset failed, try again',
};

export default function DemoDataControl({ onReset, disabled }: DemoDataControlProps) {
  const [stage, setStage] = useState<ResetStage>('idle');

  useEffect(() => {
    if (stage !== 'confirm') return;
    const timer = window.setTimeout(() => setStage('idle'), 5000);
    return () => window.clearTimeout(timer);
  }, [stage]);

  const handleClick = async () => {
    if (stage !== 'confirm' && stage !== 'error') {
      setStage('confirm');
      return;
    }
    setStage('resetting');
    try {
      await onReset();
      setStage('idle');
    } catch (error) {
      console.error(error);
      setStage('error');
    }
  };

  const isBusy = stage === 'resetting';
  const tone =
    stage === 'error'
      ? 'border-danger/60 text-danger'
      : stage === 'confirm'
        ? 'border-warning/60 bg-warning/10 text-warning'
        : 'border-obsidian-border text-slate-300 hover:border-accent/60 hover:text-white';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isBusy}
      title="Erases every study record and local app data, then loads fresh sample data."
      className={`inline-flex items-center gap-2 rounded-full border bg-obsidian-surface px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${tone}`}
    >
      <RefreshCw className={`h-4 w-4 ${isBusy ? 'animate-spin' : ''}`} />
      {LABELS[stage]}
    </button>
  );
}
