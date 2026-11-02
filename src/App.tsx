import { useEffect, useRef, useState } from 'react';
import AppHeader from '@/components/layout/AppHeader';
import AppShell from '@/components/layout/AppShell';
import ErrorNotice from '@/components/layout/ErrorNotice';
import Dashboard from '@/components/dashboard/Dashboard';
import FlashcardsPage from '@/components/cards/FlashcardsPage';
import NotesPage from '@/components/notes/NotesPage';
import StudyMethodsPage from '@/components/methods/StudyMethodsPage';
import { LOAD_ERROR_MESSAGE } from '@/lib/errors';
import { clearAllData, ensureDemoData, resetDemoData } from '@/lib/demo/demoDataService';
import type { AppView } from '@/lib/navigation';

type SeedState = 'loading' | 'ready' | 'error';

function App() {
  const [view, setView] = useState<AppView>('dashboard');
  const [seedState, setSeedState] = useState<SeedState>('loading');
  const seedPromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    if (!seedPromiseRef.current) seedPromiseRef.current = ensureDemoData();
    let active = true;
    seedPromiseRef.current.then(
      () => {
        if (active) setSeedState('ready');
      },
      (seedError: unknown) => {
        console.error(seedError);
        if (active) setSeedState('error');
      },
    );
    return () => {
      active = false;
    };
  }, []);

  const handleResetDemo = async () => {
    await resetDemoData();
    window.location.reload();
  };

  const handleClearAll = async () => {
    await clearAllData();
    window.location.reload();
  };

  return (
    <AppShell view={view} onNavigate={setView}>
      <div hidden={view !== 'dashboard'}>
        <AppHeader
          isReady={seedState === 'ready'}
          onResetDemo={handleResetDemo}
          onClearAll={handleClearAll}
        />
        <main className="mt-8">
          {seedState === 'loading' && (
            <p className="py-24 text-center text-sm text-slate-400">Preparing your study dashboard...</p>
          )}
          {seedState === 'error' && <ErrorNotice message={LOAD_ERROR_MESSAGE} />}
          {seedState === 'ready' && <Dashboard />}
        </main>
      </div>
      {view === 'cards' && <FlashcardsPage />}
      {view === 'notes' && <NotesPage onConverted={() => setView('cards')} />}
      {view === 'methods' && <StudyMethodsPage />}
    </AppShell>
  );
}

export default App;
