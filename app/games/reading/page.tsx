"use client";

import Header from "@/components/Header";
import ProfileGate from "@/components/ProfileGate";
import { useAuth } from "@/lib/auth";
import { READING_PASSAGES } from "@/data/reading";
import type { ReadingPassage } from "@/lib/types";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function ReadingPage() {
  return (
    <ProfileGate>
      <Header />
      <ReadingInner />
    </ProfileGate>
  );
}

function ReadingInner() {
  const { activeProfile } = useAuth();
  const [picked, setPicked] = useState<ReadingPassage | null>(null);

  const available = useMemo(() => {
    if (!activeProfile) return [];
    return READING_PASSAGES.filter((p) => p.level <= activeProfile.level);
  }, [activeProfile]);

  if (!activeProfile) return null;

  if (picked) {
    return <PassageView passage={picked} onBack={() => setPicked(null)} />;
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <Link href="/" className="text-slate-500 hover:text-slate-800 text-sm">
          ← לבית
        </Link>
      </div>

      <div className="card p-6">
        <h1 className="text-2xl font-bold text-slate-900">תרגול בגרות 📚</h1>
        <p className="text-slate-600 text-sm mt-1">
          בחר קטע קריאה - כמו במבחן האמיתי. קרא את הטקסט וענה על שאלות הבנת הנקרא.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {available.map((p) => (
          <button
            key={p.id}
            onClick={() => setPicked(p)}
            className="card p-5 text-right hover:shadow-xl transition hover:-translate-y-0.5"
          >
            <div className="text-xs text-slate-400 uppercase tracking-wider">
              רמה {p.level} · {p.questions.length} שאלות
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">{p.title}</h3>
            <p className="text-sm text-slate-500 mt-2 line-clamp-2">
              {p.text.slice(0, 100)}...
            </p>
          </button>
        ))}
      </div>

      {available.length === 0 && (
        <div className="card p-8 text-center text-slate-500">
          אין קטעים מתאימים לרמה שלך כרגע.
        </div>
      )}
    </main>
  );
}

function PassageView({
  passage,
  onBack,
}: {
  passage: ReadingPassage;
  onBack: () => void;
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handlePick = (qIdx: number, optIdx: number) => {
    if (submitted) return;
    setAnswers((a) => ({ ...a, [qIdx]: optIdx }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const correctCount = passage.questions.reduce(
    (sum, q, i) => sum + (answers[i] === q.answer ? 1 : 0),
    0
  );
  const total = passage.questions.length;
  const allAnswered = passage.questions.every((_, i) => answers[i] !== undefined);
  const pct = total ? Math.round((correctCount / total) * 100) : 0;

  return (
    <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 text-sm">
          ← קטעים אחרים
        </button>
        <div className="text-xs text-slate-500">רמה {passage.level}</div>
      </div>

      {submitted && (
        <div
          className={`card p-5 text-center animate-pop ${
            pct >= 75
              ? "bg-emerald-50 border-2 border-emerald-300"
              : pct >= 50
              ? "bg-amber-50 border-2 border-amber-300"
              : "bg-rose-50 border-2 border-rose-300"
          }`}
        >
          <div className="text-4xl mb-1">
            {pct >= 75 ? "🌟" : pct >= 50 ? "💪" : "📝"}
          </div>
          <div className="text-2xl font-bold">
            {correctCount}/{total} ({pct}%)
          </div>
          <div className="text-sm text-slate-600 mt-1">
            {pct >= 75
              ? "מעולה! כך עוברים בגרות."
              : pct >= 50
              ? "ממשיכים להתאמן - אתה בדרך טובה."
              : "אל דאגה - גלגל למטה לראות את התשובות הנכונות."}
          </div>
        </div>
      )}

      {/* Passage */}
      <article className="card p-6 sm:p-8" dir="ltr">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">{passage.title}</h1>
        <div className="text-slate-700 leading-relaxed whitespace-pre-line text-left">
          {passage.text}
        </div>
      </article>

      {/* Questions */}
      <div className="space-y-4" dir="ltr">
        {passage.questions.map((q, qi) => (
          <div key={qi} className="card p-5">
            <div className="font-semibold text-slate-900 text-left">
              {qi + 1}. {q.q}
            </div>
            <div className="grid grid-cols-1 gap-2 mt-3">
              {q.options.map((opt, oi) => {
                const userPick = answers[qi] === oi;
                const isAnswer = q.answer === oi;
                let cls = "border-slate-200 hover:border-primary-400 hover:bg-primary-50 bg-white text-left";
                if (submitted) {
                  if (isAnswer) {
                    cls = "border-emerald-500 bg-emerald-100 text-emerald-800";
                  } else if (userPick) {
                    cls = "border-rose-500 bg-rose-100 text-rose-800";
                  } else {
                    cls = "border-slate-200 bg-slate-50 text-slate-500";
                  }
                } else if (userPick) {
                  cls = "border-primary-500 bg-primary-50 text-primary-800";
                }
                return (
                  <button
                    key={oi}
                    onClick={() => handlePick(qi, oi)}
                    disabled={submitted}
                    className={`p-3 rounded-xl border-2 text-left transition ${cls}`}
                  >
                    <span className="font-bold text-sm mr-2">
                      {String.fromCharCode(97 + oi)})
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {submitted && q.explanation && (
              <div
                className="mt-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg text-left"
                dir="ltr"
              >
                💡 {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {allAnswered ? "בדוק תשובות" : `ענה על כל השאלות (${Object.keys(answers).length}/${total})`}
        </button>
      ) : (
        <div className="flex gap-2">
          <button onClick={onBack} className="btn btn-primary flex-1">
            קטע נוסף
          </button>
          <Link href="/" className="btn btn-ghost">לבית</Link>
        </div>
      )}
    </main>
  );
}
