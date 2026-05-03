"use client";

import Link from "next/link";
import Header from "@/components/Header";
import ProfileGate from "@/components/ProfileGate";
import { useAuth } from "@/lib/auth";
import {
  getVocabularyForSource,
  getVocabularyForLevel,
  getUnitStats,
} from "@/data/vocabulary";
import { VOCAB_SOURCES } from "@/lib/types";

const games = [
  {
    href: "/games/flashcards",
    title: "פלאשקארדים חכמים",
    desc: "חזרה מרווחת - הכי יעיל ל-10 שעות",
    emoji: "🎴",
    color: "from-blue-500 to-cyan-500",
    badge: "מומלץ",
  },
  {
    href: "/games/multiple-choice",
    title: "Multiple Choice",
    desc: "בחירה בין 4 אפשרויות",
    emoji: "✅",
    color: "from-green-500 to-emerald-500",
  },
  {
    href: "/games/matching",
    title: "משחק זיווג",
    desc: "התאמת מילה לתרגום",
    emoji: "🧩",
    color: "from-purple-500 to-fuchsia-500",
  },
  {
    href: "/games/completion",
    title: "השלמת משפטים",
    desc: "מילה חסרה במשפט",
    emoji: "✏️",
    color: "from-amber-500 to-orange-500",
  },
  {
    href: "/games/reading",
    title: "תרגול בגרות",
    desc: "קטעי קריאה + שאלות",
    emoji: "📚",
    color: "from-rose-500 to-pink-500",
  },
];

export default function HomePage() {
  return (
    <ProfileGate>
      <DashboardInner />
    </ProfileGate>
  );
}

function DashboardInner() {
  const { activeProfile, currentSource, setCurrentSource } = useAuth();
  if (!activeProfile) return null;

  // Words available for the *current source* (what the user is studying right now)
  const sourceWords = getVocabularyForSource(activeProfile.level, currentSource);
  // Full pool (for the units overview at the bottom)
  const allWords = getVocabularyForLevel(activeProfile.level);

  const knownIds = new Set(
    Object.entries(activeProfile.progress)
      .filter(([, p]) => p.known)
      .map(([id]) => id)
  );
  const knownInSource = sourceWords.filter((w) => knownIds.has(w.id)).length;
  const totalInSource = sourceWords.length;
  const wordsToLearn = totalInSource - knownInSource;
  const progressPct = totalInSource
    ? Math.round((knownInSource / totalInSource) * 100)
    : 0;
  const seenCount = Object.keys(activeProfile.progress).length;

  const unitStats = getUnitStats(activeProfile.level).map((u) => ({
    ...u,
    known: allWords.filter((w) => w.unit === u.unit && knownIds.has(w.id)).length,
  }));

  const sourceCounts: Record<string, number> = {
    teacher: allWords.filter((w) => w.unit >= 1 && w.unit <= 6).length,
    "band-a": allWords.filter((w) => w.unit === 7).length,
    "band-b": allWords.filter((w) => w.unit === 8).length,
    "band-c": allWords.filter((w) => w.unit === 9 || w.unit === 10).length,
    "band-d": allWords.filter((w) => w.unit === 11).length,
    all: allWords.length,
  };

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Hero / greeting */}
        <section className="card p-6 sm:p-8 animate-slide-up">
          <div className="flex items-start gap-4">
            <div className="text-5xl">{activeProfile.avatar}</div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                שלום, {activeProfile.name}! 👋
              </h1>
              <p className="text-slate-600 mt-1">
                רמה: {activeProfile.level} יחידות · מודול E
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-600">
                התקדמות ב-
                {VOCAB_SOURCES.find((s) => s.id === currentSource)?.label ?? "רשימה"}
              </span>
              <span className="font-semibold text-primary-700">
                {knownInSource}/{totalInSource} מילים ({progressPct}%)
              </span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-l from-primary-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              נשארו {wordsToLearn} מילים ברשימה הזו · ענית על {seenCount} מילים בסך הכל
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <Stat label="ענית" value={activeProfile.stats.totalAnswered} />
            <Stat
              label="נכון"
              value={`${activeProfile.stats.totalCorrect}/${activeProfile.stats.totalAnswered || 0}`}
            />
            <Stat label="ימים רצופים" value={activeProfile.stats.streakDays} emoji="🔥" />
          </div>
        </section>

        {/* Source / list selector */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3 px-1">
            מאיזו רשימה ללמוד?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {VOCAB_SOURCES.map((src) => {
              const count = sourceCounts[src.id] ?? 0;
              const active = currentSource === src.id;
              const disabled = count === 0;
              return (
                <button
                  key={src.id}
                  onClick={() => !disabled && setCurrentSource(src.id)}
                  disabled={disabled}
                  className={`p-3 rounded-2xl text-right transition border ${
                    active
                      ? "bg-primary-600 text-white border-primary-600 shadow-md"
                      : disabled
                      ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                      : "bg-white text-slate-800 border-slate-200 hover:border-primary-300 hover:shadow"
                  }`}
                >
                  <div className="text-xl">{src.emoji}</div>
                  <div className="font-bold text-sm leading-tight mt-1">
                    {src.label}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      active ? "text-primary-100" : "text-slate-500"
                    }`}
                  >
                    {count} מילים
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Games */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3 px-1">
            בחר משחק
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((g) => (
              <Link
                key={g.href}
                href={g.href}
                className="card p-5 hover:shadow-xl transition-all hover:-translate-y-1 group relative overflow-hidden"
              >
                <div
                  className={`absolute -left-10 -top-10 w-32 h-32 rounded-full bg-gradient-to-br ${g.color} opacity-10 group-hover:opacity-20 transition`}
                />
                {g.badge && (
                  <span className="absolute top-3 left-3 text-[10px] bg-accent-500 text-white px-2 py-0.5 rounded-full font-bold">
                    {g.badge}
                  </span>
                )}
                <div className="text-4xl mb-2">{g.emoji}</div>
                <h3 className="font-bold text-lg text-slate-900">{g.title}</h3>
                <p className="text-slate-600 text-sm mt-1">{g.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Units */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3 px-1">
            יחידות
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {unitStats.map((u) => {
              // Units 1-6 = רשימת המורה (PDF, מאורגנת לפי דפים)
              // 7-11 = משרד החינוך (Band A-D)
              const teacherLabels: Record<number, { top: string; main: string }> = {
                1: { top: "דף 1", main: "A1-A3" },
                2: { top: "דף 2", main: "A4-A6" },
                3: { top: "דף 3", main: "B1-B3" },
                4: { top: "דף 4", main: "B4-B6" },
                5: { top: "דף 5", main: "extra" },
                6: { top: "דף 6", main: "extra" },
              };
              const ministryLabels = ["A", "B", "C", "C+", "D"];
              const label =
                u.unit <= 6
                  ? teacherLabels[u.unit]
                  : { top: "Band", main: ministryLabels[u.unit - 7] || `${u.unit}` };
              return (
                <div key={u.unit} className="card p-4 text-center">
                  <div className="text-xs text-slate-500">{label.top}</div>
                  <div className="text-xl font-bold text-primary-700">
                    {label.main}
                  </div>
                  <div className="text-sm mt-1 text-slate-700">
                    {u.known}/{u.total}
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-primary-500"
                      style={{
                        width: `${u.total ? Math.round((u.known / u.total) * 100) : 0}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}

function Stat({ label, value, emoji }: { label: string; value: string | number; emoji?: string }) {
  return (
    <div className="bg-slate-50 rounded-xl p-3 text-center">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-bold text-lg text-slate-900">
        {emoji && <span className="ml-1">{emoji}</span>}
        {value}
      </div>
    </div>
  );
}
