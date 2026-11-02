export type StudyMethod = {
  id: string;
  name: string;
  icon: 'timer' | 'lightbulb' | 'brain' | 'repeat' | 'network' | 'book' | 'sparkles' | 'columns';
  description: string;
  steps: [string, string, string];
  bestFor: string;
};

export const STUDY_METHODS: StudyMethod[] = [
  {
    id: 'pomodoro',
    name: 'Pomodoro',
    icon: 'timer',
    description: 'Work in short, intense blocks with planned breaks so your attention stays sharp for the whole session.',
    steps: [
      'Choose one task and write it down.',
      'Work for 25 minutes without switching tasks.',
      'Take a 5-minute break, then repeat. Take a longer break after four blocks.',
    ],
    bestFor: 'Routine practice and staying focused',
  },
  {
    id: 'feynman',
    name: 'Feynman',
    icon: 'lightbulb',
    description: 'Explain a concept in plain language as if teaching a beginner. Gaps in your explanation show what to review.',
    steps: [
      'Write the topic name at the top of a blank page.',
      'Explain it in simple words, without jargon.',
      'Where you get stuck, go back to the source, then explain again.',
    ],
    bestFor: 'Understanding complex concepts',
  },
  {
    id: 'active-recall',
    name: 'Active Recall',
    icon: 'brain',
    description: 'Pull information out of memory instead of re-reading it. Retrieval is what makes knowledge stick.',
    steps: [
      'Close your notes after reading a section.',
      'Write or say everything you remember about it.',
      'Check your notes, then fill in what you missed.',
    ],
    bestFor: 'Memorising facts and definitions',
  },
  {
    id: 'spaced-repetition',
    name: 'Spaced Repetition',
    icon: 'repeat',
    description: 'Review material at growing intervals. Each review lands just before you would forget, which builds long-term memory.',
    steps: [
      'Review new material the same day you learn it.',
      'Review again after 1, 3, and 7 days.',
      'Lengthen the gap when you recall easily, and shorten it when you do not.',
    ],
    bestFor: 'Long-term retention before exams',
  },
  {
    id: 'mind-map',
    name: 'Mind Map',
    icon: 'network',
    description: 'Place the central idea in the middle of a page and branch out to related subtopics, keywords, and examples.',
    steps: [
      'Write the main topic in the centre of the page.',
      'Add branches for each subtopic, using one or two words per branch.',
      'Link related branches and add small sketches or colours to anchor memory.',
    ],
    bestFor: 'Seeing connections across a whole topic',
  },
  {
    id: 'sq3r',
    name: 'SQ3R',
    icon: 'book',
    description: 'A five-step reading method: Survey, Question, Read, Recite, Review. It turns passive reading into active study.',
    steps: [
      'Survey the chapter by skimming headings and summaries.',
      'Turn each heading into a question, then read to answer it.',
      'Recite the answers from memory, then review the whole section.',
    ],
    bestFor: 'Textbook chapters and long readings',
  },
  {
    id: 'blurting',
    name: 'Blurting',
    icon: 'sparkles',
    description: 'Write everything you know about a topic on a blank page, then compare it with your notes to find the gaps.',
    steps: [
      'Read a section once, then put the notes away.',
      'On a blank page, write everything you remember, with no peeking.',
      'Compare with your notes, mark the gaps, and blurt again on those parts.',
    ],
    bestFor: 'Quick revision before a test',
  },
  {
    id: 'cornell',
    name: 'Cornell',
    icon: 'columns',
    description: 'Split each page into a cue column, a notes area, and a summary strip so you can review and self-test easily.',
    steps: [
      'Draw a narrow cue column on the left and a wide notes area on the right.',
      'Take notes in the right area during the lesson.',
      'After class, write questions in the cue column and a short summary at the bottom.',
    ],
    bestFor: 'Lecture notes and class revision',
  },
];
