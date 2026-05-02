"use client";

import Link from "next/link";
import Header from "@/components/Header";
import ProfileGate from "@/components/ProfileGate";
import { useAuth } from "@/lib/auth";
import { getVocabularyForLevel, getUnitStats } from "@/data/vocabulary";

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
  const { activeProfile } = useAuth();
  if (!activeProfile) return null;

  const allWords = getVocabularyForLevel(activeProfile.level);
  const knownIds = new Set(
    Object.entries(activeProfile.progress)
      .filter(([, p]) => p.known)
      .map(([id]) => id)
  );
  const knownCount = knownIds.size;
  const seenCount = Object.keys(activeProfile.progress).length;
  const totalWords = allWords.length;
  const wordsToLearn = totalWords - knownCount;
  const progressPct = totalWords ? Math.round((knownCount / totalWords) * 100) : 0;

  const unitStats = getUnitStats(activeProfile.level).map((u) => ({
    ...u,
    known: allWords.filter((w) => w.unit === u.unit && knownIds.has(w.id)).length,
  }));

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
              <span className="text-slate-600">התקדמות</span>
              <span className="font-semibold text-primary-700">
                {knownCount}/{totalWords} מילים ({progressPct}%)
              </span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-l from-primary-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              נשארו {wordsToLearn} מילים ללמוד · ענית על {seenCount} מילים עד עכשיו
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
            יחידות (B1-B6)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {unitStats.map((u) => (
              <div
                key={u.unit}
                className="card p-4 text-center"
              >
                <div className="text-xs text-slate-500">יחידה</div>
                <div className="text-2xl font-bold text-primary-700">B{u.unit}</div>
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
            ))}
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
