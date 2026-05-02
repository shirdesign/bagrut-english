"use client";

import Header from "@/components/Header";
import ProfileGate from "@/components/ProfileGate";
import { useAuth } from "@/lib/auth";
import { SENTENCE_COMPLETIONS } from "@/data/reading";
import { VOCABULARY } from "@/data/vocabulary";
import type { SentenceCompletion } from "@/lib/types";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const SESSION_SIZE = 8;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface PreparedQ {
  base: SentenceCompletion;
  options: string[];
  /** word id from vocabulary, if found */
  wordId: string | null;
}

function prepare(q: SentenceCompletion): PreparedQ {
  const distractors = q.distractors ?? [];
  const options = shuffle([q.answer, ...distractors]).slice(0, 4);
  if (!options.includes(q.answer)) options[0] = q.answer;
  const word = VOCABULARY.find((v) => v.english.toLowerCase() === q.answer.toLowerCase());
  return { base: q, options, wordId: word?.id ?? null };
}

export default function CompletionPage() {
  return (
    <ProfileGate>
      <Header />
      <CompletionInner />
    </ProfileGate>
  );
}

function CompletionInner() {
  const { activeProfile, recordAnswer } = useAuth();
  const [round, setRound] = useState(0);
  const [questions, setQuestions] = useState<PreparedQ[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
  const [done, setDone] = useState(false);

  const pool = useMemo(() => {
    if (!activeProfile) return [];
    return SENTENCE_COMPLETIONS.filter((s) => s.minLevel <= activeProfile.level);
  }, [activeProfile]);

  useEffect(() => {
    const sample = shuffle(pool).slice(0, SESSION_SIZE);
    setQuestions(sample.map(prepare));
    setIdx(0);
    setPicked(null);
    setStats({ correct: 0, incorrect: 0 });
    setDone(false);
  }, [pool, round]);

  if (!activeProfile) return null;

  const q = questions[idx];

  const handlePick = async (option: string) => {
    if (picked !== null || !q) return;
    setPicked(option);
    const isCorrect = option === q.base.answer;
    if (q.wordId) {
      await recordAnswer(q.wordId, isCorrect);
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
    }, 1200);
  };

  if (questions.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="card p-8 text-center">
          <div className="animate-pulse text-slate-500">טוען...</div>
        </div>
      </main>
    );
  }

  if (done) {
    const total = stats.correct + stats.incorrect;
    const pct = total ? Math.round((stats.correct / total) * 100) : 0;
    return (
      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="card p-8 text-center animate-pop">
          <div className="text-6xl mb-3">{pct >= 80 ? "🌟" : pct >= 60 ? "💪" : "📝"}</div>
          <h2 className="text-2xl font-bold mb-2">סבב הסתיים!</h2>
          <p className="text-slate-600 mb-5">
            ענית נכון על {stats.correct} מתוך {total} ({pct}%)
          </p>
          <div className="flex gap-2 justify-center">
            <button onClick={() => setRound((r) => r + 1)} className="btn btn-primary">
              סבב נוסף
            </button>
            <Link href="/" className="btn btn-ghost">לבית</Link>
          </div>
        </div>
      </main>
    );
  }

  // render the sentence with the blank highlighted
  const before = q.base.sentence.split("__")[0];
  const after = q.base.sentence.split("__")[1] ?? "";
  const progressPct = Math.round((idx / questions.length) * 100);

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <Link href="/" className="text-slate-500 hover:text-slate-800 text-sm">
          ← לבית
        </Link>
        <div className="flex-1 mx-3 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-l from-amber-500 to-orange-400 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="text-sm text-slate-600">
          {idx + 1}/{questions.length}
        </div>
      </div>

      <div className="card p-6 sm:p-8" dir="ltr">
        <div className="text-2xl sm:text-3xl text-slate-900 leading-relaxed text-left font-medium">
          {before}
          <span className="inline-block min-w-[120px] mx-1 px-3 py-1 bg-amber-100 border-b-4 border-amber-400 rounded text-amber-800 font-bold">
            {picked ?? "____"}
          </span>
          {after}
        </div>
        {q.base.hint && picked === null && (
          <div className="text-sm text-slate-500 mt-4 text-right" dir="rtl">
            רמז: {q.base.hint}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {q.options.map((opt) => {
          const isCorrect = opt === q.base.answer;
          const isPicked = picked === opt;
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
              key={opt}
              onClick={() => handlePick(opt)}
              disabled={picked !== null}
              className={`p-4 rounded-2xl border-2 font-semibold text-lg transition ${cls}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <div className="flex justify-center gap-4 text-sm text-slate-500">
        <span>✓ {stats.correct}</span>
        <span>✗ {stats.incorrect}</span>
      </div>
    </main>
  );
}
