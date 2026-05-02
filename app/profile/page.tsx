"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import type { Level } from "@/lib/types";
import Header from "@/components/Header";

const AVATARS = ["🦊", "🐱", "🐶", "🐼", "🦁", "🐯", "🐸", "🐵", "🦄", "🐧", "🦉", "🐝"];

export default function ProfilePage() {
  const {
    profiles,
    selectProfile,
    createProfile,
    deleteProfile,
    user,
    firebaseEnabled,
    signInWithGoogle,
    signOutAll,
  } = useAuth();
  const router = useRouter();

  const [creating, setCreating] = useState(profiles.length === 0);
  const [name, setName] = useState("");
  const [level, setLevel] = useState<Level>(4);
  const [avatar, setAvatar] = useState(AVATARS[0]);

  const handleSelect = (id: string) => {
    selectProfile(id);
    router.push("/");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createProfile({ name: name.trim(), level, avatar });
    router.push("/");
  };

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Sign-in row */}
        <div className="card p-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-700">
              {user ? `מחובר: ${user.email}` : "מצב אורח"}
            </div>
            <div className="text-xs text-slate-500">
              {firebaseEnabled
                ? user
                  ? "הנתונים נשמרים בענן ומסונכרנים בין מכשירים"
                  : "התחבר עם Google כדי לסנכרן בין מכשירים"
                : "Firebase לא מוגדר - הנתונים נשמרים מקומית בלבד"}
            </div>
          </div>
          <div className="flex gap-2">
            {!user && firebaseEnabled && (
              <button onClick={signInWithGoogle} className="btn btn-primary">
                התחבר עם Google
              </button>
            )}
            {user && (
              <button onClick={signOutAll} className="btn btn-secondary">
                התנתק
              </button>
            )}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 px-1">
          {profiles.length ? "בחר פרופיל" : "צור פרופיל ראשון"}
        </h1>

        {/* Existing profiles */}
        {profiles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profiles.map((p) => (
              <div key={p.id} className="card p-5 flex items-center gap-4">
                <div className="text-5xl">{p.avatar}</div>
                <div className="flex-1">
                  <div className="font-bold text-lg">{p.name}</div>
                  <div className="text-sm text-slate-500">
                    {p.level} יחידות · {Object.values(p.progress).filter(x => x.known).length} מילים ידועות
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleSelect(p.id)}
                    className="btn btn-primary !py-2 !px-4 text-sm"
                  >
                    כנס
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm(`למחוק את ${p.name}? כל ההתקדמות תאבד.`)) {
                        await deleteProfile(p.id);
                      }
                    }}
                    className="text-xs text-rose-500 hover:underline"
                  >
                    מחק
                  </button>
                </div>
              </div>
            ))}

            {!creating && (
              <button
                onClick={() => setCreating(true)}
                className="card p-5 flex items-center justify-center gap-2 border-2 border-dashed border-primary-300 text-primary-600 hover:bg-primary-50"
              >
                <span className="text-2xl">+</span>
                <span className="font-semibold">פרופיל חדש</span>
              </button>
            )}
          </div>
        )}

        {/* Create new profile */}
        {creating && (
          <form onSubmit={handleCreate} className="card p-6 space-y-5 animate-slide-up">
            <h2 className="text-lg font-bold">פרופיל חדש</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                שם
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="שם הילד/ה"
                required
                className="input"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                בחר אווטאר
              </label>
              <div className="flex flex-wrap gap-2">
                {AVATARS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAvatar(a)}
                    className={`text-3xl w-12 h-12 rounded-xl flex items-center justify-center transition ${
                      avatar === a
                        ? "bg-primary-100 ring-2 ring-primary-500 scale-110"
                        : "bg-slate-100 hover:bg-slate-200"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                רמת בגרות
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[3, 4, 5].map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLevel(l as Level)}
                    className={`py-3 rounded-xl border-2 font-bold transition ${
                      level === l
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {l} יחידות
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {level === 3 && "רמת בסיס"}
                {level === 4 && "רמת ביניים - הפורמט הנפוץ למודול E"}
                {level === 5 && "רמה גבוהה - כולל מילים מתקדמות וקטעים ארוכים יותר"}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="submit" className="btn btn-primary flex-1">
                צור פרופיל
              </button>
              {profiles.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCreating(false)}
                  className="btn btn-ghost"
                >
                  ביטול
                </button>
              )}
            </div>
          </form>
        )}
      </main>
    </>
  );
}
