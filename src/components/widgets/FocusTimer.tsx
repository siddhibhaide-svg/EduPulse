import { useEffect, useState } from 'react';
import { Minus, Pause, Play, Plus, RotateCcw, Timer } from 'lucide-react';
import BentoCard from '@/components/layout/BentoCard';
import ErrorNotice from '@/components/layout/ErrorNotice';
import { useElapsedClock } from '@/hooks/useElapsedClock';
import { SAVE_ERROR_MESSAGE } from '@/lib/errors';
import { formatDuration } from '@/lib/dates';
import ManualSessionForm from '@/components/widgets/ManualSessionForm';
import { recordFocusSession } from '@/lib/studyLog';
import type { StudySubject } from '@/types/study';

type TimerMode = 'pomodoro' | 'stopwatch';
type Phase = 'focus' | 'break';
type PresetId = 'deep' | 'long';

const PRESETS: { id: PresetId; label: string; focus: number; rest: number }[] = [
  { id: 'deep', label: 'Deep Focus', focus: 25, rest: 5 },
  { id: 'long', label: 'Long Block', focus: 45, rest: 15 },
];

const FOCUS_RANGE = { min: 1, max: 120 };
const NO_SUBJECT_MESSAGE = 'Add a subject in Revision Tracker to save this focus block.';
const BREAK_RANGE = { min: 1, max: 60 };
const MODES: { id: TimerMode; label: string }[] = [
  { id: 'pomodoro', label: 'Pomodoro' },
  { id: 'stopwatch', label: 'Stopwatch' },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

type FocusTimerProps = {
  subjects: StudySubject[];
  className?: string;
};

export default function FocusTimer({ subjects, className = '' }: FocusTimerProps) {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [presetId, setPresetId] = useState<PresetId | 'custom'>('deep');
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [phase, setPhase] = useState<Phase>('focus');
  const [completedSessions, setCompletedSessions] = useState(0);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [logError, setLogError] = useState<string | null>(null);
  const { elapsedMs, isRunning, start, pause, reset } = useElapsedClock();

  const isPomodoro = mode === 'pomodoro';
  const activeSubjectId = subjects.some(subject => subject.id === subjectId)
    ? subjectId
    : (subjects[0]?.id ?? null);
  const canStart = !isPomodoro || activeSubjectId !== null;
  const phaseMs = (phase === 'focus' ? focusMinutes : breakMinutes) * 60_000;
  const displayMs = isPomodoro ? Math.max(0, phaseMs - elapsedMs) : elapsedMs;
  const ringPercent = isPomodoro
    ? (displayMs / phaseMs) * 100
    : ((elapsedMs % 60_000) / 60_000) * 100;

  useEffect(() => {
    if (!isPomodoro || !isRunning || displayMs > 0) return;
    reset();
    if (phase === 'focus') {
      setCompletedSessions(count => count + 1);
      setLogError(null);
      if (activeSubjectId) {
        void recordFocusSession(focusMinutes, activeSubjectId).then(saved => {
          if (!saved) setLogError(SAVE_ERROR_MESSAGE);
        });
      } else {
        setLogError(NO_SUBJECT_MESSAGE);
      }
    }
    setPhase(current => (current === 'focus' ? 'break' : 'focus'));
  }, [isPomodoro, isRunning, displayMs, phase, reset, focusMinutes, activeSubjectId]);

  const resetSession = () => {
    reset();
    setPhase('focus');
  };

  const changeMode = (next: TimerMode) => {
    setMode(next);
    resetSession();
  };

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setPresetId(preset.id);
    setFocusMinutes(preset.focus);
    setBreakMinutes(preset.rest);
    resetSession();
  };

  const adjustFocus = (delta: number) => {
    setPresetId('custom');
    setFocusMinutes(current => clamp(current + delta, FOCUS_RANGE.min, FOCUS_RANGE.max));
    resetSession();
  };

  const adjustBreak = (delta: number) => {
    setPresetId('custom');
    setBreakMinutes(current => clamp(current + delta, BREAK_RANGE.min, BREAK_RANGE.max));
    resetSession();
  };

  const phaseLabel = isPomodoro ? (phase === 'focus' ? 'Focus block' : 'Break time') : 'Elapsed';
  const ringTone = isPomodoro && phase === 'break' ? 'stroke-success' : 'stroke-accent';
  const controlsLocked = isRunning;

  return (
    <BentoCard
      title="Focus Timer"
      icon={Timer}
      className={`lg:col-span-7 ${className}`}
      active={isRunning}
      action={
        <div className="inline-flex rounded-xl border border-obsidian-border bg-obsidian-canvas p-1">
          {MODES.map(option => (
            <button
              key={option.id}
              type="button"
              aria-pressed={mode === option.id}
              onClick={() => changeMode(option.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                mode === option.id
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="grid flex-1 gap-8 xl:grid-cols-2 xl:items-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative h-56 w-56">
            <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90" aria-hidden="true">
              <circle
                cx="100"
                cy="100"
                r="88"
                fill="none"
                strokeWidth="8"
                pathLength={100}
                className="stroke-obsidian-border"
              />
              <circle
                cx="100"
                cy="100"
                r="88"
                fill="none"
                strokeWidth="8"
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray={100}
                strokeDashoffset={100 - ringPercent}
                className={`${ringTone} transition-[stroke-dashoffset] duration-300 ease-linear`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="font-mono text-[clamp(2.5rem,11vw,3.5rem)] font-semibold tabular-nums tracking-tight"
                aria-live="off"
              >
                {formatDuration(displayMs)}
              </span>
              <span className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                {phaseLabel}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => (isRunning ? pause() : start())}
              disabled={!isRunning && !canStart}
              aria-label={isRunning ? 'Pause timer' : 'Start timer'}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white shadow-[0_12px_28px_-10px_rgba(79,70,229,0.9)] transition hover:bg-accent-hover active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRunning ? (
                <Pause className="h-6 w-6" fill="currentColor" />
              ) : (
                <Play className="ml-1 h-6 w-6" fill="currentColor" />
              )}
            </button>
            <button
              type="button"
              onClick={resetSession}
              aria-label="Reset timer"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-obsidian-border bg-obsidian-canvas text-slate-300 transition hover:border-accent/60 hover:text-white active:scale-95"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>
        </div>

        {isPomodoro ? (
          <div className="flex flex-col gap-6">
            <ErrorNotice message={logError} />
            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Studying
              </span>
              <select
                className="field-input"
                value={activeSubjectId ?? ''}
                disabled={controlsLocked || subjects.length === 0}
                onChange={event => setSubjectId(event.target.value)}
              >
                {subjects.length === 0 && <option value="">Add a subject first</option>}
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </label>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Presets
              </p>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map(preset => {
                  const active = presetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      disabled={controlsLocked}
                      aria-pressed={active}
                      onClick={() => applyPreset(preset)}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        active
                          ? 'border-accent bg-accent text-white'
                          : 'border-obsidian-border text-slate-300 hover:border-accent/60 hover:text-white'
                      }`}
                    >
                      {preset.focus}-{preset.rest} {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <DurationStepper
                label="Focus"
                value={focusMinutes}
                disabled={controlsLocked}
                onDecrease={() => adjustFocus(-1)}
                onIncrease={() => adjustFocus(1)}
              />
              <DurationStepper
                label="Break"
                value={breakMinutes}
                disabled={controlsLocked}
                onDecrease={() => adjustBreak(-1)}
                onIncrease={() => adjustBreak(1)}
              />
            </div>

            <p className="text-sm text-slate-400">
              {controlsLocked
                ? 'Pause the timer to adjust your session.'
                : `Focus sessions completed today: ${completedSessions}`}
            </p>
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-slate-400">
            Stopwatch mode counts up from zero. Pause whenever you need a break, and reset to start a
            fresh session.
          </p>
        )}
      </div>
      <ManualSessionForm subjects={subjects} />
    </BentoCard>
  );
}

type DurationStepperProps = {
  label: string;
  value: number;
  disabled: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
};

function DurationStepper({ label, value, disabled, onDecrease, onIncrease }: DurationStepperProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-obsidian-border bg-obsidian-canvas/60 px-4 py-3">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="font-mono text-sm tabular-nums text-slate-400">{value} min</p>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label={`Decrease ${label.toLowerCase()} minutes`}
          disabled={disabled}
          onClick={onDecrease}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-obsidian-border text-slate-300 transition hover:border-accent/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span
          key={value}
          className="w-12 animate-pop-in text-center font-mono text-lg font-semibold tabular-nums"
        >
          {value}
        </span>
        <button
          type="button"
          aria-label={`Increase ${label.toLowerCase()} minutes`}
          disabled={disabled}
          onClick={onIncrease}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-obsidian-border text-slate-300 transition hover:border-accent/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
