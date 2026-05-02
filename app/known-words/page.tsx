"use client";

import Header from "@/components/Header";
import ProfileGate from "@/components/ProfileGate";
import { useAuth } from "@/lib/auth";
import { getVocabularyForLevel } from "@/data/vocabulary";
import { useState } from "react";

export default function KnownWordsPage() {
  return (
    <ProfileGate>
      <Header />
      <KnownInner />
    </ProfileGate>
  );
}

function KnownInner() {
  const { activeProfile, setWordKnown } = useAuth();
  const [filter, setFilter] = useState<"known" | "learning" | "all">("known");
  if (!activeProfile) return null;

  const all = getVocabularyForLevel(activeProfile.level);
  const knownEntries = Object.values(activeProfile.progress).filter((p) => p.known);
  const learningEntries = Object.values(activeProfile.progress).filter(
    (p) => !p.known && (p.correct + p.incorrect) > 0
  );

  const showWords = (() => {
    if (filter === "known")
      return all.filter((w) => activeProfile.progress[w.id]?.known);
    if (filter === "learning")
      return all.filter((w) => {
        const p = activeProfile.progress[w.id];
        return p && !p.known && p.correct + p.incorrect > 0;
      });
    return all;
  })();

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-slate-900">המילים שלי</h1>
        <p className="text-slate-600 text-sm mt-1">
          מילים שענית עליהן נכון 3+ פעמים עוברות אוטומטית לרשימת "ידועות".
        </p>

        <div className="grid grid-cols-3 gap-3 mt-5">
          <button
            onClick={() => setFilter("known")}
            className={`p-4 rounded-xl border-2 transition ${
              filter === "known"
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="text-2xl">✅</div>
            <div className="text-2xl font-bold text-emerald-700">{knownEntries.length}</div>
            <div className="text-xs text-slate-600">ידועות</div>
          </button>
          <button
            onClick={() => setFilter("learning")}
            className={`p-4 rounded-xl border-2 transition ${
              filter === "learning"
                ? "border-amber-500 bg-amber-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="text-2xl">📖</div>
            <div className="text-2xl font-bold text-amber-700">{learningEntries.length}</div>
            <div className="text-xs text-slate-600">בלמידה</div>
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`p-4 rounded-xl border-2 transition ${
              filter === "all"
                ? "border-primary-500 bg-primary-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="text-2xl">📚</div>
            <div className="text-2xl font-bold text-primary-700">{all.length}</div>
            <div className="text-xs text-slate-600">סך הכל</div>
          </button>
        </div>
      </div>

      <div className="card p-4 space-y-1 max-h-[60vh] overflow-y-auto">
        {showWords.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            עדיין אין כאן מילים. תתחיל לתרגל בעמוד הבית 💪
          </div>
        )}
        {showWords.map((w) => {
          const p = activeProfile.progress[w.id];
          const isKnown = p?.known;
          return (
            <div
              key={w.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
            >
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-slate-900">{w.english}</span>
                  <span className="text-xs text-slate-400">{w.pos}</span>
                  <span className="text-xs bg-slate-100 px-2 rounded">B{w.unit}</span>
                </div>
                <div className="text-slate-600 text-sm">{w.hebrew}</div>
                {p && (
                  <div className="text-xs text-slate-400 mt-1">
                    ✓ {p.correct} · ✗ {p.incorrect}
                  </div>
                )}
              </div>
              <button
                onClick={() => setWordKnown(w.id, !isKnown)}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${
                  isKnown
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {isKnown ? "ידועה ✓" : "סמן כידועה"}
              </button>
            </div>
          );
        })}
      </div>
    </main>
  );
}
