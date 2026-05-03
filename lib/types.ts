// Core type definitions for the Bagrut English study app

export type PartOfSpeech =
  | "n"
  | "v"
  | "adj"
  | "adv"
  | "prep"
  | "conj"
  | "pron"
  | "phrase";

export type Level = 3 | 4 | 5;

export interface VocabularyWord {
  /** unique stable id */
  id: string;
  /** English word or phrase */
  english: string;
  /** Hebrew translation(s), comma separated */
  hebrew: string;
  /** part of speech */
  pos: PartOfSpeech;
  /** which unit/section in the module-E book (1..6) */
  unit: number;
  /** an example English sentence using the word (optional but recommended) */
  example?: string;
  /** Hebrew translation of the example (optional) */
  exampleHe?: string;
  /** minimum yehidot level — word appears for level >= minLevel */
  minLevel: Level;
}

export interface ReadingPassage {
  id: string;
  title: string;
  level: Level;
  text: string;
  questions: Array<{
    q: string;
    options: string[];
    answer: number; // index of the correct option
    explanation?: string;
  }>;
}

export interface SentenceCompletion {
  id: string;
  /** sentence with __ where the word should go */
  sentence: string;
  /** the correct word (must exist in vocabulary) */
  answer: string;
  /** distractor words for multiple-choice version */
  distractors?: string[];
  /** Hebrew hint */
  hint?: string;
  minLevel: Level;
}

export interface WordProgress {
  wordId: string;
  /** number of correct answers in any game */
  correct: number;
  /** number of incorrect answers */
  incorrect: number;
  /** SM-2 spaced repetition fields */
  ef: number; // ease factor (default 2.5)
  interval: number; // days
  repetitions: number;
  /** unix timestamp ms — when due next */
  due: number;
  /** if the user marked it as "I know this", or auto-marked after 3 corrects */
  known: boolean;
  /** last seen unix timestamp */
  lastSeen: number;
}

export interface Profile {
  id: string;
  name: string;
  level: Level;
  /** emoji avatar for fun */
  avatar: string;
  /** map of wordId -> progress */
  progress: Record<string, WordProgress>;
  /** stats */
  stats: {
    totalAnswered: number;
    totalCorrect: number;
    streakDays: number;
    lastStudyDate: string; // YYYY-MM-DD
    totalMinutes: number;
  };
  createdAt: number;
}

export type GameType =
  | "flashcards"
  | "multiple-choice"
  | "matching"
  | "completion"
  | "reading";

/** Vocabulary source/list selector */
export type VocabSource =
  | "all"        // כל המילים
  | "teacher"    // רשימת המורה (יחידות B1-B6)
  | "band-a"     // משרד החינוך — Band A
  | "band-b"     // משרד החינוך — Band B
  | "band-c"     // משרד החינוך — Band C
  | "band-d";    // משרד החינוך — Band D

export const VOCAB_SOURCES: { id: VocabSource; label: string; emoji: string }[] = [
  { id: "teacher", label: "רשימת המורה (A1-A6 + B1-B6)", emoji: "📘" },
  { id: "band-a", label: "Band A — בסיס", emoji: "🅰️" },
  { id: "band-b", label: "Band B — בסיס+", emoji: "🅱️" },
  { id: "band-c", label: "Band C — מתקדם", emoji: "🇨" },
  { id: "band-d", label: "Band D — מתקדם+", emoji: "🇩" },
  { id: "all", label: "כל המילים", emoji: "🌐" },
];
