"use client";

import Header from "@/components/Header";
import ProfileGate from "@/components/ProfileGate";
import { useAuth } from "@/lib/auth";
import { getVocabularyForLevel } from "@/data/vocabulary";
import { pickReviewWords } from "@/lib/spacedRepetition";
import type { VocabularyWord } from "@/lib/types";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const SESSION_SIZE = 12;

export default function FlashcardsPage() {
  return (
    <ProfileGate>
      <Header />
      <FlashcardsInner />
    </ProfileGate>
  );
}

function FlashcardsInner() {
  const { activeProfile, recordAnswer } = useAuth();
  const [queue, setQueue] = useState<VocabularyWord[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
  const [autoKnown, setAutoKnown] = useState<string[]>([]);

  const all = useMemo(
    () => (activeProfile ? getVocabularyForLevel(activeProfile.level) : []),
    [activeProfile]
  );

  // build initial queue once profile is ready
  useEffect(() => {
    if (!activeProfile) return;
    const next = pickReviewWords(all, activeProfile.progress, SESSION_SIZE);
    if (next.length === 0) {
      // everything is known — fall back to a random sample including known
      const sample = [...all].sort(() => Math.random() - 0.5).slice(0, SESSION_SIZE);
      setQueue(sample);
    } else {
      setQueue(next);
    }
    setIdx(0);
    setFlipped(false);
    setDone(false);
    setStats({ correct: 0, incorrect: 0 });
    setAutoKnown([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProfile?.id]);

  if (!activeProfile) return null;

  const current = queue[idx];

  const handleAnswer = async (correct: boolean) => {
    if (!current) return;
    const wasAlreadyKnown = activeProfile.progress[current.id]?.known;
    const updated = await recordAnswer(current.id, correct);
    if (updated && !wasAlreadyKnown && updated.known) {
      setAutoKnown((prev) => [...prev, current.english]);
    }
    setStats((s) => ({
      correct: s.correct + (correct ? 1 : 0),
      incorrect: s.incorrect + (correct ? 0 : 1),
    }));
    if (idx + 1 >= queue.length) {
      setDone(true);
    } else {
      setIdx(idx + 1);
      setFlipped(false);
    }
  };

  const restart = () => {
    const next = pickReviewWords(all, activeProfile.progress, SESSION_SIZE);
    setQueue(next.length ? next : [...all].sort(() => Math.random() - 0.5).slice(0, SESSION_SIZE));
    setIdx(0);
    setFlipped(false);
    setDone(false);
    setStats({ correct: 0, incorrect: 0 });
    setAutoKnown([]);
  };

  if (queue.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="card p-8 text-center">
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="text-xl font-bold mb-2">אין מילים ללמידה כרגע</h2>
          <p className="text-slate-600">בחר משחק אחר או חזור מאוחר יותר.</p>
          <Link href="/" className="btn btn-primary mt-5 inline-block">חזור לבית</Link>
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
              <div className="text-sm text-emerald-800">
                {autoKnown.join(" · ")}
              </div>
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

  const progressPct = Math.round(((idx) / queue.length) * 100);

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3">
        <Link href="/" className="text-slate-500 hover:text-slate-800 text-sm">
          ← לבית
        </Link>
        <div className="flex-1 mx-3 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-l from-primary-500 to-cyan-400 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="text-sm text-slate-600">
          {idx + 1}/{queue.length}
        </div>
      </div>

      {/* Flashcard */}
      <div
        className="flip-card h-72 sm:h-80 cursor-pointer"
        onClick={() => setFlipped((f) => !f)}
      >
        <div className={`flip-card-inner ${flipped ? "flipped" : ""}`}>
          {/* FRONT - English */}
          <div className="flip-card-face card flex flex-col items-center justify-center p-6 text-center">
            <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">
              {current.pos} · יחידה B{current.unit}
            </div>
            <div className="text-4xl sm:text-5xl font-bold text-slate-900">
              {current.english}
            </div>
            {current.example && (
              <div className="text-sm text-slate-500 mt-4 italic">
                {current.example}
              </div>
            )}
            <div className="text-xs text-slate-400 mt-6">
              👆 לחץ כדי לראות את התרגום
            </div>
          </div>

          {/* BACK - Hebrew */}
          <div className="flip-card-face flip-card-back card flex flex-col items-center justify-center p-6 text-center">
            <div className="text-2xl text-slate-500 mb-2">
              {current.english}
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-primary-700">
              {current.hebrew}
            </div>
            {current.exampleHe && (
              <div className="text-sm text-slate-500 mt-4 italic">
                {current.exampleHe}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Answer buttons */}
      {flipped ? (
        <div className="grid grid-cols-2 gap-3 animate-slide-up">
          <button
            onClick={() => handleAnswer(false)}
            className="bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold py-4 rounded-2xl transition"
          >
            😕 לא ידעתי
          </button>
          <button
            onClick={() => handleAnswer(true)}
            className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-bold py-4 rounded-2xl transition"
          >
            😎 ידעתי
          </button>
        </div>
      ) : (
        <div className="text-center text-sm text-slate-500">
          חשוב על התרגום, ואז הפוך את הכרטיסייה
        </div>
      )}

      {/* Session stats */}
      <div className="flex justify-center gap-4 text-sm text-slate-500">
        <span>✓ {stats.correct}</span>
        <span>✗ {stats.incorrect}</span>
      </div>
    </main>
  );
}
