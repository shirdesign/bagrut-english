"use client";

import Header from "@/components/Header";
import ProfileGate from "@/components/ProfileGate";
import { useAuth } from "@/lib/auth";
import { getVocabularyForSource } from "@/data/vocabulary";
import { pickReviewWords } from "@/lib/spacedRepetition";
import type { VocabularyWord } from "@/lib/types";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const SESSION_SIZE = 12;

interface Question {
  word: VocabularyWord;
  options: string[];
  correctIdx: number;
  /** if true, ask English -> Hebrew, else Hebrew -> English */
  enToHe: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestion(word: VocabularyWord, pool: VocabularyWord[]): Question {
  const enToHe = Math.random() > 0.4;
  const distractors = shuffle(pool.filter((w) => w.id !== word.id))
    .slice(0, 6)
    .filter((w) => (enToHe ? w.hebrew !== word.hebrew : w.english !== word.english))
    .slice(0, 3);
  const correctText = enToHe ? word.hebrew : word.english;
  const optionTexts = shuffle([
    correctText,
    ...distractors.map((d) => (enToHe ? d.hebrew : d.english)),
  ]);
  return {
    word,
    options: optionTexts,
    correctIdx: optionTexts.indexOf(correctText),
    enToHe,
  };
}

export default function MultipleChoicePage() {
  return (
    <ProfileGate>
      <Header />
      <MCInner />
    </ProfileGate>
  );
}

function MCInner() {
  const { activeProfile, recordAnswer, currentSource } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
  const [done, setDone] = useState(false);
  const [autoKnown, setAutoKnown] = useState<string[]>([]);

  const all = useMemo(
    () =>
      activeProfile
        ? getVocabularyForSource(activeProfile.level, currentSource)
        : [],
    [activeProfile, currentSource]
  );

  useEffect(() => {
    if (!activeProfile) return;
    const picked = pickReviewWords(all, activeProfile.progress, SESSION_SIZE);
    const list = picked.length ? picked : shuffle(all).slice(0, SESSION_SIZE);
    setQuestions(list.map((w) => buildQuestion(w, all)));
    setIdx(0);
    setPicked(null);
    setStats({ correct: 0, incorrect: 0 });
    setDone(false);
    setAutoKnown([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProfile?.id, currentSource]);

  if (!activeProfile) return null;

  const q = questions[idx];

  const handlePick = async (i: number) => {
    if (picked !== null || !q) return;
    setPicked(i);
    const isCorrect = i === q.correctIdx;
    const wasAlreadyKnown = activeProfile.progress[q.word.id]?.known;
    const updated = await recordAnswer(q.word.id, isCorrect);
    if (updated && !wasAlreadyKnown && updated.known) {
      setAutoKnown((prev) => [...prev, q.word.english]);
    }
    setStats((s) => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      incorrect: s.incorrect + (isCorrect ? 0 : 1),
    }));
    setTimeout(() => {
      if (idx + 1 >= questions.length) {
        setDone(true);
      } else {
        setIdx(idx + 1);
        setPicked(null);
      }
    }, 1100);
  };

  const restart = () => {
    const picked = pickReviewWords(all, activeProfile.progress, SESSION_SIZE);
    const list = picked.length ? picked : shuffle(all).slice(0, SESSION_SIZE);
    setQuestions(list.map((w) => buildQuestion(w, all)));
    setIdx(0);
    setPicked(null);
    setStats({ correct: 0, incorrect: 0 });
    setDone(false);
    setAutoKnown([]);
  };

  if (questions.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="card p-8 text-center">
          <div className="animate-pulse text-slate-500">טוען שאלות...</div>
        </div>
      </main>
    );
  }

  if (done) {
    const total = stats.correct + stats.incorrect;
    const pct = total ? Math.round((stats.correct / total) * 100) : 0;
    return (
      <main className="max-w-2xl mx-auto px-4 py-10 space-y-5">
        <div className="card p-8 text-center animate-pop">
          <div className="text-6xl mb-3">{pct >= 80 ? "🌟" : pct >= 60 ? "💪" : "📚"}</div>
          <h2 className="text-2xl font-bold mb-2">סבב הסתיים!</h2>
          <p className="text-slate-600 mb-5">
            ענית נכון על {stats.correct} מתוך {total} ({pct}%)
          </p>
          {autoKnown.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4 text-right">
              <div className="font-bold text-emerald-700 mb-2">
                ✅ {autoKnown.length} מילים עברו ל"ידועות":
              </div>
              <div className="text-sm text-emerald-800">{autoKnown.join(" · ")}</div>
            </div>
          )}
          <div className="flex gap-2 justify-center">
            <button onClick={restart} className="btn btn-primary">סבב נוסף</button>
            <Link href="/" className="btn btn-ghost">לבית</Link>
          </div>
        </div>
      </main>
    );
  }

  const progressPct = Math.round((idx / questions.length) * 100);
  const question = q.enToHe
    ? `מה התרגום של "${q.word.english}"?`
    : `איך אומרים באנגלית: "${q.word.hebrew}"?`;

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <Link href="/" className="text-slate-500 hover:text-slate-800 text-sm">
          ← לבית
        </Link>
        <div className="flex-1 mx-3 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-l from-emerald-500 to-cyan-400 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="text-sm text-slate-600">
          {idx + 1}/{questions.length}
        </div>
      </div>

      <div className="card p-6 sm:p-8 text-center">
        <div className="text-xs text-slate-400 uppercase tracking-wider">
          {q.word.pos} · {q.word.unit <= 6 ? `דף ${q.word.unit} (רשימת המורה)` : `Band ${["A","B","C","C+","D"][q.word.unit - 7] || q.word.unit}`}
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
          {question}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correctIdx;
          const isPicked = picked === i;
          let cls = "border-slate-200 hover:border-primary-400 hover:bg-primary-50 bg-white";
          if (picked !== null) {
            if (isCorrect) {
              cls = "border-emerald-500 bg-emerald-100 text-emerald-800";
            } else if (isPicked) {
              cls = "border-rose-500 bg-rose-100 text-rose-800 animate-shake";
            } else {
              cls = "border-slate-200 bg-slate-50 text-slate-400";
            }
          }
          return (
            <button
              key={i}
              onClick={() => handlePick(i)}
              disabled={picked !== null}
              className={`p-4 rounded-2xl border-2 font-semibold text-lg transition ${cls}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {picked !== null && q.word.example && (
        <div className="card p-4 animate-slide-up">
          <div className="text-xs text-slate-500 mb-1">דוגמה:</div>
          <div className="text-slate-700">{q.word.example}</div>
          {q.word.exampleHe && (
            <div className="text-slate-500 text-sm mt-1">{q.word.exampleHe}</div>
          )}
        </div>
      )}

      <div className="flex justify-center gap-4 text-sm text-slate-500">
        <span>✓ {stats.correct}</span>
        <span>✗ {stats.incorrect}</span>
      </div>
    </main>
  );
}
