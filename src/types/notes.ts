export type NoteDefinition = {
  term: string;
  meaning: string;
};

export type RevisionQuestion = {
  question: string;
  source: string;
};

export type OnePageNotes = {
  keyPoints: string[];
  formulas: string[];
  definitions: NoteDefinition[];
  questions: RevisionQuestion[];
};

export type NoteDocument = {
  id: string;
  title: string;
  text: string;
  createdAt: string;
  summary: OnePageNotes | null;
};
