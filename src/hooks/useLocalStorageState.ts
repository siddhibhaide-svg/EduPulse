import { useEffect, useState } from 'react';
import { readJson, writeJson } from '@/lib/localStorageJson';

export function useLocalStorageState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readJson(key, fallback));
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    setSaveFailed(!writeJson(key, value));
  }, [key, value]);

  return { value, setValue, saveFailed };
}
