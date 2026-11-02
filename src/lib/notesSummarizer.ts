import type { OnePageNotes, RevisionQuestion } from '@/types/notes';

const STOPWORDS = new Set([
  'the', 'and', 'for', 'are', 'was', 'were', 'with', 'that', 'this', 'from', 'which', 'these', 'those',
  'have', 'has', 'had', 'not', 'but', 'can', 'will', 'its', 'into', 'than', 'also', 'such', 'each',
  'their', 'they', 'you', 'your', 'our', 'about', 'when', 'where', 'what', 'there', 'then', 'been',
  'being', 'more', 'most', 'some', 'many', 'other', 'only', 'over', 'under', 'between', 'through',
  'does', 'did', 'use', 'used', 'using', 'like', 'just', 'very', 'both', 'either', 'may', 'might',
]);

const NON_TERMS = new Set(['this', 'it', 'these', 'those', 'there', 'here', 'that', 'he', 'she', 'we']);

const IMPORTANCE_PATTERN = /\b(important|key|must|note|defined?|result|principle|therefore|conclusion|main|essential|critical)\b/i;
const FORMULA_PATTERN = /[A-Za-z0-9)\]]\s*=\s*[A-Za-z0-9(\\-]|[²³√∑∫π±×÷]/;
const DEFINITION_PATTERN =
  /^([A-Z][A-Za-z0-9 \-()]{1,50}?)\s+(?:is defined as|refers to|is called|is|are|means|denotes)\s+(.{8,})$/;

const MAX_KEY_POINTS = 6;
const MAX_FORMULAS = 8;
const MAX_DEFINITIONS = 6;
const QUESTION_COUNT = 5;

export function summarizeNotes(text: string): OnePageNotes {
  const lines = text
    .split(/\r?\n/)
    .map(line => line.replace(/\s+/g, ' ').trim())
    .filter(line => line.length > 0);

  const headings = lines.filter(isHeading).map(cleanHeading);
  const formulas = unique(lines.filter(isFormulaLine)).slice(0, MAX_FORMULAS);
  const sentences = lines
    .flatMap(line => line.split(/(?<=[.!?])\s+(?=[A-Z0-9(])/))
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length >= 25 && sentence.length <= 240);

  const definitions = extractDefinitions(sentences);
  const proseSentences = sentences.filter(sentence => !isFormulaLine(sentence));
  const keyPoints = pickKeyPoints(proseSentences, MAX_KEY_POINTS);
  const questions = buildQuestions(definitions, headings, keyPoints, text);

  return { keyPoints, formulas, definitions, questions };
}

function isHeading(line: string): boolean {
  if (line.length < 3 || line.length > 70) return false;
  if (FORMULA_PATTERN.test(line)) return false;
  if (/^(\d+(\.\d+)*|[IVX]+)[.)]?\s+[A-Z]/.test(line)) return true;
  if (line.endsWith(':')) return true;
  if (/[.!?;,]$/.test(line)) return false;
  const words = line.split(' ');
  if (words.length > 6) return false;
  if (line === line.toUpperCase() && /[A-Z]{3,}/.test(line)) return true;
  const capitalised = words.filter(word => /^[A-Z]/.test(word)).length;
  return capitalised >= Math.ceil(words.length * 0.6);
}

function cleanHeading(line: string): string {
  return line.replace(/:$/, '').replace(/^(\d+(\.\d+)*|[IVX]+)[.)]?\s+/, '').trim();
}

function isFormulaLine(line: string): boolean {
  return line.length <= 140 && line.split(' ').length <= 14 && FORMULA_PATTERN.test(line);
}

function extractDefinitions(sentences: string[]) {
  const seen = new Set<string>();
  const definitions: { term: string; meaning: string }[] = [];
  for (const sentence of sentences) {
    const match = DEFINITION_PATTERN.exec(sentence);
    if (!match) continue;
    const term = match[1].trim();
    const key = term.toLowerCase();
    if (term.split(' ').length > 5 || NON_TERMS.has(key) || seen.has(key)) continue;
    seen.add(key);
    definitions.push({ term, meaning: match[2].replace(/[.]+$/, '').trim() });
    if (definitions.length === MAX_DEFINITIONS) break;
  }
  return definitions;
}

function tokenize(sentence: string): string[] {
  const words = sentence.toLowerCase().match(/[a-z][a-z-]{2,}/g) ?? [];
  return words.filter(word => !STOPWORDS.has(word));
}

function pickKeyPoints(sentences: string[], count: number): string[] {
  const frequency = new Map<string, number>();
  for (const sentence of sentences) {
    for (const word of new Set(tokenize(sentence))) {
      frequency.set(word, (frequency.get(word) ?? 0) + 1);
    }
  }

  const scored = sentences.map((sentence, index) => {
    const words = tokenize(sentence);
    const weight = [...new Set(words)].reduce((sum, word) => sum + (frequency.get(word) ?? 0), 0);
    const normalised = words.length > 0 ? weight / Math.sqrt(words.length) : 0;
    const boost = IMPORTANCE_PATTERN.test(sentence) ? 3 : 0;
    return { sentence, index, score: normalised + boost };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .sort((a, b) => a.index - b.index)
    .map(item => item.sentence);
}

function buildQuestions(
  definitions: { term: string; meaning: string }[],
  headings: string[],
  keyPoints: string[],
  text: string,
): RevisionQuestion[] {
  const candidates: RevisionQuestion[] = [
    ...definitions.slice(0, 3).map(definition => ({
      question: `What is ${definition.term}?`,
      source: `${definition.term} is ${definition.meaning}.`,
    })),
    ...headings.slice(0, 2).map(heading => ({
      question: `Explain the main ideas behind "${heading}".`,
      source: findRelatedSentence(heading, keyPoints) ?? heading,
    })),
    ...keyPoints.map(point => ({
      question: `Explain why this holds: "${firstWords(point, 10).replace(/[.,;:!?]$/, '')}..."`,
      source: point,
    })),
    {
      question: 'What are the three most important ideas in these notes?',
      source: keyPoints[0] ?? firstWords(text, 30),
    },
    {
      question: 'Summarise the topic in two sentences without looking at your notes.',
      source: keyPoints[1] ?? keyPoints[0] ?? firstWords(text, 30),
    },
    {
      question: 'Which idea from these notes would you explain first to a friend, and why?',
      source: keyPoints[2] ?? keyPoints[0] ?? firstWords(text, 30),
    },
  ];

  const seen = new Set<string>();
  return candidates
    .filter(candidate => {
      const key = candidate.question.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, QUESTION_COUNT);
}

function findRelatedSentence(heading: string, sentences: string[]): string | null {
  const headingWords = new Set(tokenize(heading));
  let best: { sentence: string; overlap: number } | null = null;
  for (const sentence of sentences) {
    const overlap = tokenize(sentence).filter(word => headingWords.has(word)).length;
    if (overlap > 0 && (!best || overlap > best.overlap)) best = { sentence, overlap };
  }
  return best?.sentence ?? null;
}

function firstWords(text: string, count: number): string {
  return text.split(' ').slice(0, count).join(' ');
}

function unique(items: string[]): string[] {
  return [...new Set(items)];
}
