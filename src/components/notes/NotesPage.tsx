import { useState, type ChangeEvent } from 'react';
import { Download, Layers, Sparkles, Trash2, Upload } from 'lucide-react';
import BentoCard from '@/components/layout/BentoCard';
import ErrorNotice from '@/components/layout/ErrorNotice';
import PageHeader from '@/components/layout/PageHeader';
import OnePageNotesSheet from '@/components/notes/OnePageNotesSheet';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { appendFlashcardDeck } from '@/lib/flashcardStore';
import { NOTE_DOCUMENT_KEY } from '@/lib/localAppData';
import { extractTextFromFile } from '@/lib/extractNoteText';
import { notesToFlashcardDeck } from '@/lib/notesToFlashcards';
import { summarizeNotes } from '@/lib/notesSummarizer';
import type { NoteDocument } from '@/types/notes';

const MIN_SUMMARY_CHARACTERS = 40;
const ACCEPTED_FILE_TYPES = 'application/pdf,image/png,image/jpeg,image/webp';

type NotesPageProps = {
  onConverted: () => void;
};

export default function NotesPage({ onConverted }: NotesPageProps) {
  const { value: note, setValue: setNote, saveFailed } = useLocalStorageState<NoteDocument | null>(
    NOTE_DOCUMENT_KEY,
    null,
  );
  const [isReading, setIsReading] = useState(false);
  const [readingStatus, setReadingStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canGenerate = note !== null && note.text.length >= MIN_SUMMARY_CHARACTERS;

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setIsReading(true);
    setErrorMessage(null);
    try {
      const text = await extractTextFromFile(file, setReadingStatus);
      if (!text) {
        setErrorMessage('No readable text was found. Try a clearer photo or a PDF with selectable text.');
        return;
      }
      setNote({
        id: crypto.randomUUID(),
        title: file.name.replace(/\.[^.]+$/, ''),
        text,
        createdAt: new Date().toISOString(),
        summary: null,
      });
    } catch (error) {
      console.error(error);
      setErrorMessage('We could not read that file. Try a different PDF or image.');
    } finally {
      setIsReading(false);
      setReadingStatus(null);
    }
  };

  const handleGenerate = () => {
    if (!note || !canGenerate) return;
    setErrorMessage(null);
    setNote({ ...note, summary: summarizeNotes(note.text) });
  };

  const handleConvert = () => {
    if (!note?.summary) return;
    const deck = notesToFlashcardDeck(note.title, note.summary);
    if (appendFlashcardDeck(deck)) {
      onConverted();
    } else {
      setErrorMessage('Could not save the flashcards. Browser storage may be full.');
    }
  };

  const handleClear = () => {
    setNote(null);
    setErrorMessage(null);
  };

  const saveMessage = saveFailed ? 'Browser storage is full, so this note may not be saved.' : null;

  return (
    <div>
      <PageHeader
        title="Notes"
        description="Upload a PDF or a photo of your notes, then turn it into a one-page revision sheet."
      />
      <div className="flex flex-col gap-5 lg:gap-6">
        <ErrorNotice message={errorMessage ?? saveMessage} />

        <BentoCard
          title="Source material"
          icon={Upload}
          action={
            note && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-2 rounded-xl border border-obsidian-border bg-obsidian-canvas px-3.5 py-2 text-sm font-semibold text-slate-300 transition hover:border-danger/60 hover:text-danger"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            )
          }
        >
          <label
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-obsidian-border bg-obsidian-canvas/60 px-6 py-10 text-center transition hover:border-accent/60 hover:bg-obsidian-canvas ${
              isReading ? 'pointer-events-none opacity-70' : ''
            }`}
          >
            <input
              type="file"
              accept={ACCEPTED_FILE_TYPES}
              onChange={handleFileChange}
              disabled={isReading}
              className="sr-only"
            />
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent-light ring-1 ring-accent/30">
              <Upload className="h-5 w-5" />
            </span>
            <span className="font-semibold">
              {isReading ? (readingStatus ?? 'Reading your file...') : note ? 'Replace with another PDF or image' : 'Choose a PDF or image'}
            </span>
            <span className="text-sm text-slate-400">
              PDFs are read directly. Photos and scans are read with OCR, which runs in your browser.
            </span>
          </label>

          {note && (
            <div className="mt-6 flex animate-fade-up flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="truncate font-semibold">{note.title}</h3>
                <span className="text-xs text-slate-400">{note.text.length.toLocaleString()} characters</span>
              </div>
              <div className="max-h-72 overflow-y-auto whitespace-pre-wrap rounded-xl border border-obsidian-border bg-obsidian-canvas p-4 text-sm leading-relaxed text-slate-300">
                {note.text}
              </div>
            </div>
          )}
        </BentoCard>

        <BentoCard title="One-page notes" icon={Sparkles} active={note?.summary != null}>
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]"
              >
                <Sparkles className="h-4 w-4" />
                Generate One-Page Notes
              </button>
              {note?.summary && (
                <>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    title="Opens the print dialog. Choose Save as PDF to download."
                    className="inline-flex items-center gap-2 rounded-xl border border-obsidian-border bg-obsidian-canvas px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-accent/60 hover:text-white"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </button>
                  <button
                    type="button"
                    onClick={handleConvert}
                    className="inline-flex items-center gap-2 rounded-xl border border-success/40 bg-success/10 px-4 py-2.5 text-sm font-semibold text-success transition hover:bg-success/20"
                  >
                    <Layers className="h-4 w-4" />
                    Convert to Flashcards
                  </button>
                </>
              )}
            </div>

            {!note && (
              <p className="text-sm text-slate-400">Upload a file first, then generate a one-page summary.</p>
            )}
            {note && !canGenerate && (
              <p className="text-sm text-slate-400">The extracted text is too short to summarise.</p>
            )}
            {note?.summary && (
              <div className="overflow-x-auto rounded-2xl bg-obsidian-canvas p-3 sm:p-6">
                <OnePageNotesSheet title={note.title} notes={note.summary} />
              </div>
            )}
          </div>
        </BentoCard>
      </div>
    </div>
  );
}
