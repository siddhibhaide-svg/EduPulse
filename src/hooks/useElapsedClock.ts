import { useCallback, useEffect, useState } from 'react';

export function useElapsedClock() {
  const [accumulatedMs, setAccumulatedMs] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (startedAt === null) return;
    const id = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(id);
  }, [startedAt]);

  const start = useCallback(() => {
    const timestamp = Date.now();
    setNow(timestamp);
    setStartedAt(timestamp);
  }, []);

  const pause = useCallback(() => {
    if (startedAt === null) return;
    const timestamp = Date.now();
    setAccumulatedMs(prev => prev + (timestamp - startedAt));
    setStartedAt(null);
  }, [startedAt]);

  const reset = useCallback(() => {
    setAccumulatedMs(0);
    setStartedAt(null);
  }, []);

  const elapsedMs = accumulatedMs + (startedAt === null ? 0 : now - startedAt);

  return { elapsedMs, isRunning: startedAt !== null, start, pause, reset };
}
