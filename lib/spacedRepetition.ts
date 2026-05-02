import type { WordProgress } from "./types";

/**
 * SM-2 (SuperMemo 2) spaced repetition algorithm.
 * https://en.wikipedia.org/wiki/SuperMemo
 *
 * quality 0-2 = wrong (start over)
 * quality 3-5 = correct (with increasing ease)
 */

const DAY_MS = 24 * 60 * 60 * 1000;

export function newProgress(wordId: string): WordProgress {
  return {
    wordId,
    correct: 0,
    incorrect: 0,
    ef: 2.5,
    interval: 0,
    repetitions: 0,
    due: Date.now(),
    known: false,
    lastSeen: 0,
  };
}

export function applyAnswer(
  progress: WordProgress,
  correct: boolean
): WordProgress {
  const quality = correct ? 5 : 1;
  const next: WordProgress = { ...progress, lastSeen: Date.now() };

  if (correct) {
    next.correct = (progress.correct ?? 0) + 1;
  } else {
    next.incorrect = (progress.incorrect ?? 0) + 1;
  }

  // SM-2 update
  if (quality < 3) {
    next.repetitions = 0;
    next.interval = 1;
  } else {
    next.repetitions = (progress.repetitions ?? 0) + 1;
    if (next.repetitions === 1) {
      next.interval = 1;
    } else if (next.repetitions === 2) {
      next.interval = 3;
    } else {
      next.interval = Math.round((progress.interval || 1) * (progress.ef || 2.5));
    }
  }

  // ease factor update
  next.ef = Math.max(
    1.3,
    (progress.ef || 2.5) +
      (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  next.due = Date.now() + next.interval * DAY_MS;

  // auto-mark as known after 3+ correct answers
  if (next.correct >= 3 && !next.known) {
    next.known = true;
  }

  return next;
}

/**
 * Pick the next words to review.
 * Strategy:
 *  1. Words that are "due" (due <= now) come first, sorted by oldest due.
 *  2. Then never-seen words.
 *  3. Known words are excluded unless includeKnown is true.
 */
export function pickReviewWords<T extends { id: string }>(
  allWords: T[],
  progressMap: Record<string, WordProgress>,
  count: number,
  includeKnown = false
): T[] {
  const now = Date.now();
  type Scored = { word: T; score: number };
  const scored: Scored[] = allWords
    .filter((w) => {
      const p = progressMap[w.id];
      if (!includeKnown && p?.known) return false;
      return true;
    })
    .map((w) => {
      const p = progressMap[w.id];
      if (!p) return { word: w, score: 1 }; // never seen — high priority
      if (p.due <= now) return { word: w, score: 2 + (now - p.due) / DAY_MS }; // overdue — highest
      return { word: w, score: -((p.due - now) / DAY_MS) }; // not due yet
    });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map((s) => s.word);
}
