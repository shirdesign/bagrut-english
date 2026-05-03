"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getFirebase, isFirebaseConfigured } from "./firebase";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import type { Profile, WordProgress, VocabSource } from "./types";
import {
  getActiveProfileId,
  loadProfiles,
  saveProfile,
  setActiveProfileId,
  deleteProfileLocal,
} from "./storage";
import { applyAnswer, newProgress } from "./spacedRepetition";

interface AuthContextValue {
  /** Firebase user, or null if guest / not signed in */
  user: User | null;
  /** Whether Firebase is configured at build time */
  firebaseEnabled: boolean;
  /** Whether the auth state has finished loading on first mount */
  ready: boolean;

  /** All profiles for the current user (or guest) */
  profiles: Profile[];
  /** Active profile id (null = none selected) */
  activeProfileId: string | null;
  /** Active profile object (convenience) */
  activeProfile: Profile | null;

  signInWithGoogle: () => Promise<void>;
  signOutAll: () => Promise<void>;

  selectProfile: (id: string) => void;
  createProfile: (
    p: Omit<Profile, "id" | "progress" | "stats" | "createdAt">
  ) => Promise<Profile>;
  updateProfile: (p: Profile) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;

  /** Record an answer for a word in the active profile */
  recordAnswer: (wordId: string, correct: boolean) => Promise<WordProgress | null>;
  /** Force a word to be known/unknown */
  setWordKnown: (wordId: string, known: boolean) => Promise<void>;

  /** Currently selected vocabulary source (per profile, persisted to localStorage) */
  currentSource: VocabSource;
  setCurrentSource: (source: VocabSource) => void;
}

const SOURCE_KEY = (profileId: string) => `bagrut_source_${profileId}`;

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [currentSource, setCurrentSourceState] = useState<VocabSource>("teacher");

  // Load saved source whenever active profile changes
  useEffect(() => {
    if (!activeId || typeof window === "undefined") return;
    const saved = window.localStorage.getItem(SOURCE_KEY(activeId));
    if (saved) {
      setCurrentSourceState(saved as VocabSource);
    } else {
      setCurrentSourceState("teacher"); // default for new profiles
    }
  }, [activeId]);

  const setCurrentSource = (source: VocabSource) => {
    setCurrentSourceState(source);
    if (activeId && typeof window !== "undefined") {
      window.localStorage.setItem(SOURCE_KEY(activeId), source);
    }
  };

  useEffect(() => {
    if (isFirebaseConfigured) {
      const { auth } = getFirebase();
      if (!auth) {
        setReady(true);
        return;
      }
      const unsub = onAuthStateChanged(auth, async (u) => {
        setUser(u);
        const profs = await loadProfiles(u?.uid ?? null);
        setProfiles(profs);
        const stored = getActiveProfileId();
        if (stored && profs.some((p) => p.id === stored)) {
          setActiveId(stored);
        } else if (profs.length === 1) {
          setActiveId(profs[0].id);
          setActiveProfileId(profs[0].id);
        }
        setReady(true);
      });
      return () => unsub();
    } else {
      // guest mode
      (async () => {
        const profs = await loadProfiles(null);
        setProfiles(profs);
        const stored = getActiveProfileId();
        if (stored && profs.some((p) => p.id === stored)) {
          setActiveId(stored);
        }
        setReady(true);
      })();
    }
  }, []);

  const activeProfile =
    profiles.find((p) => p.id === activeId) ?? null;

  const value: AuthContextValue = useMemo(() => {
    return {
      user,
      firebaseEnabled: isFirebaseConfigured,
      ready,
      profiles,
      activeProfileId: activeId,
      activeProfile,

      async signInWithGoogle() {
        if (!isFirebaseConfigured) {
          alert("התחברות עם Google לא מוגדרת. השתמש במצב אורח כרגע.");
          return;
        }
        const { auth } = getFirebase();
        if (!auth) return;
        await signInWithPopup(auth, new GoogleAuthProvider());
      },

      async signOutAll() {
        setActiveId(null);
        setActiveProfileId(null);
        if (isFirebaseConfigured) {
          const { auth } = getFirebase();
          if (auth) await signOut(auth);
        }
      },

      selectProfile(id) {
        setActiveId(id);
        setActiveProfileId(id);
      },

      async createProfile(p) {
        const fresh: Profile = {
          ...p,
          id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          progress: {},
          stats: {
            totalAnswered: 0,
            totalCorrect: 0,
            streakDays: 0,
            lastStudyDate: "",
            totalMinutes: 0,
          },
          createdAt: Date.now(),
        };
        await saveProfile(user?.uid ?? null, fresh);
        setProfiles((prev) => [...prev, fresh]);
        setActiveId(fresh.id);
        setActiveProfileId(fresh.id);
        return fresh;
      },

      async updateProfile(p) {
        await saveProfile(user?.uid ?? null, p);
        setProfiles((prev) => prev.map((x) => (x.id === p.id ? p : x)));
      },

      async deleteProfile(id) {
        await deleteProfileLocal(id);
        setProfiles((prev) => prev.filter((p) => p.id !== id));
        if (activeId === id) setActiveId(null);
      },

      async recordAnswer(wordId, correct) {
        if (!activeProfile) return null;
        const existing = activeProfile.progress[wordId] ?? newProgress(wordId);
        const updated = applyAnswer(existing, correct);
        const today = new Date().toISOString().slice(0, 10);
        const prevStats = activeProfile.stats;
        const newProfile: Profile = {
          ...activeProfile,
          progress: { ...activeProfile.progress, [wordId]: updated },
          stats: {
            ...prevStats,
            totalAnswered: prevStats.totalAnswered + 1,
            totalCorrect: prevStats.totalCorrect + (correct ? 1 : 0),
            streakDays:
              prevStats.lastStudyDate === today
                ? prevStats.streakDays
                : prevStats.streakDays + 1,
            lastStudyDate: today,
          },
        };
        await saveProfile(user?.uid ?? null, newProfile);
        setProfiles((prev) => prev.map((x) => (x.id === newProfile.id ? newProfile : x)));
        return updated;
      },

      async setWordKnown(wordId, known) {
        if (!activeProfile) return;
        const existing = activeProfile.progress[wordId] ?? newProgress(wordId);
        const updated: WordProgress = { ...existing, known };
        const newProfile: Profile = {
          ...activeProfile,
          progress: { ...activeProfile.progress, [wordId]: updated },
        };
        await saveProfile(user?.uid ?? null, newProfile);
        setProfiles((prev) => prev.map((x) => (x.id === newProfile.id ? newProfile : x)));
      },

      currentSource,
      setCurrentSource,
    };
  }, [user, ready, profiles, activeId, activeProfile, currentSource]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
