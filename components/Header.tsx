"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Header() {
  const { activeProfile, signOutAll, user } = useAuth();
  const router = useRouter();

  return (
    <header className="bg-white/90 backdrop-blur border-b border-slate-100 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">📘</span>
          <span className="font-bold text-lg text-primary-700 group-hover:text-primary-800">
            אנגלית בגרות
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1 mr-auto">
          <Link
            href="/"
            className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            בית
          </Link>
          <Link
            href="/known-words"
            className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            מילים שאני יודע
          </Link>
        </nav>

        {activeProfile && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/profile")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 text-primary-800 hover:bg-primary-100 transition"
              title="החלף פרופיל"
            >
              <span className="text-xl">{activeProfile.avatar}</span>
              <span className="font-medium hidden sm:inline">
                {activeProfile.name}
              </span>
              <span className="text-xs bg-white px-2 py-0.5 rounded-full">
                {activeProfile.level}
              </span>
            </button>
            <button
              onClick={async () => {
                await signOutAll();
                router.push("/");
              }}
              className="text-slate-400 hover:text-rose-500 text-sm"
              title={user ? "התנתק" : "החלף משתמש"}
            >
              {user ? "התנתק" : "←"}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
