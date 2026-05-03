"use client";

import Header from "@/components/Header";
import ProfileGate from "@/components/ProfileGate";
import { useAuth } from "@/lib/auth";
import { getVocabularyForSource } from "@/data/vocabulary";
import { pickReviewWords } from "@/lib/spacedRepetition";
import type { VocabularyWord } from "@/lib/types";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const PAIR_COUNT = 6;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MatchingPage() {
  return (
    <ProfileGate>
      <Header />
      <MatchingInner />
    </ProfileGate>
  );
}

function MatchingInner() {
  const { activeProfile, recordAnswer, currentSource } = useAuth();
  const [round, setRound] = useState(0); // forces reshuffle
  const [pairs, setPairs] = useState<VocabularyWord[]>([]);
  const [enList, setEnList] = useState<VocabularyWord[]>([]);
  const [heList, setHeList] = useState<VocabularyWord[]>([]);
  const [pickedEn, setPickedEn] = useState<string | null>(null);
  const [pickedHe, setPickedHe] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<{ en: string; he: string } | null>(null);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
  const [autoKnown, setAutoKnown] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const all = useMemo(
    () =>
      activeProfile
        ? getVocabularyForSource(activeProfile.level, currentSource)
        : [],
    [activeProfile, currentSource]
  );

  useEffect(() => {
    if (!activeProfile) return;
    const picked = pickReviewWords(all, activeProfile.progress, PAIR_COUNT);
    const list = picked.length ? picked : shuffle(all).slice(0, PAIR_COUNT);
    setPairs(list);
    setEnList(shuffle(list));
    setHeList(shuffle(list));
    setPickedEn(null);
    setPickedHe(null);
    setMatched(new Set());
    setWrong(null);
    setDone(false);
    setStats({ correct: 0, incorrect: 0 });
    setAutoKnown([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProfile?.id, round, currentSource]);

  // resolve a pair when both sides chosen
  useEffect(() => {
    if (!activeProfile) return;
    if (!pickedEn || !pickedHe) return;
    const isMatch = pickedEn === pickedHe;
    const wordId = pickedEn;
    const word = pairs.find((p) => p.id === wordId);
    if (!word) return;
    (async () => {
      const wasAlreadyKnown = activeProfile.progress[word.id]?.known;
      const updated = await recordAnswer(word.id, isMatch);
      if (updated && !wasAlreadyKnown && updated.known) {
        setAutoKnown((prev) => [...prev, word.english]);
      }
      setStats((s) => ({
        correct: s.correct + (isMatch ? 1 : 0),
        incorrect: s.incorrect + (isMatch ? 0 : 1),
      }));
      if (isMatch) {
        const next = new Set(matched);
        next.add(wordId);
        setMatched(next);
        setPickedEn(null);
        setPickedHe(null);
        if (next.size === pairs.length) {
          setTimeout(() => setDone(true), 400);
        }
      } else {
        setWrong({ en: pickedEn, he: pickedHe });
        setTimeout(() => {
          setPickedEn(null);
          setPickedHe(null);
          setWrong(null);
        }, 700);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickedEn, pickedHe]);

  const restart = () => setRound((r) => r + 1);

  if (!activeProfile) return null;

  if (pairs.length === 0) {
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
          <div className="text-6xl mb-3">{pct >= 80 ? "🌟" : "🎯"}</div>
          <h2 className="text-2xl font-bold mb-2">כל הזיווגים הושלמו!</h2>
          <p className="text-slate-600 mb-5">
            ניסיונות מוצלחים: {stats.correct} · שגיאות: {stats.incorrect}
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

  const cardClass = (id: string, side: "en" | "he") => {
    const isMatched = matched.has(id);
    const isPicked = side === "en" ? pickedEn === id : pickedHe === id;
    const isWrong = wrong && (side === "en" ? wrong.en === id : wrong.he === id);
    if (isMatched) return "bg-emerald-100 border-emerald-300 text-emerald-700 opacity-60 cursor-default";
    if (isWrong) return "bg-rose-100 border-rose-400 text-rose-700 animate-shake";
    if (isPicked) return "bg-primary-100 border-primary-500 text-primary-800 scale-105";
    return "bg-white border-slate-200 hover:border-primary-300 hover:bg-primary-50 cursor-pointer";
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <Link href="/" className="text-slate-500 hover:text-slate-800 text-sm">
          ← לבית
        </Link>
        <div className="text-sm text-slate-600">
          זוגות: {matched.size}/{pairs.length}
        </div>
      </div>

      <div className="card p-5 text-center">
        <h1 className="text-xl font-bold text-slate-900">משחק זיווג 🧩</h1>
        <p className="text-sm text-slate-500 mt-1">
          לחץ על מילה באנגלית, ואז על התרגום שלה
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* English column */}
        <div className="space-y-2">
          <div className="text-xs text-slate-400 text-center uppercase">English</div>
          {enList.map((w) => (
            <button
              key={`en-${w.id}`}
              disabled={matched.has(w.id) || (wrong !== null && wrong.en === w.id)}
              onClick={() => setPickedEn(w.id)}
              className={`w-full p-3 sm:p-4 rounded-xl border-2 font-semibold transition ${cardClass(w.id, "en")}`}
            >
              {w.english}
            </button>
          ))}
        </div>

        {/* Hebrew column */}
        <div className="space-y-2">
          <div className="text-xs text-slate-400 text-center uppercase">עברית</div>
          {heList.map((w) => (
            <button
              key={`he-${w.id}`}
              disabled={matched.has(w.id) || (wrong !== null && wrong.he === w.id)}
              onClick={() => setPickedHe(w.id)}
              className={`w-full p-3 sm:p-4 rounded-xl border-2 font-semibold transition ${cardClass(w.id, "he")}`}
            >
              {w.hebrew}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-4 text-sm text-slate-500">
        <span>✓ {stats.correct}</span>
        <span>✗ {stats.incorrect}</span>
      </div>
    </main>
  );
}
