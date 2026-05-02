"use client";

import type { Profile } from "./types";
import { getFirebase, isFirebaseConfigured } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
} from "firebase/firestore";

/**
 * Storage abstraction. Saves profile data to Firestore when the user is
 * logged in with Firebase, and to localStorage otherwise.
 *
 * Profiles are scoped per user (Firebase uid) or globally for guests.
 */

const LS_PROFILES = "bagrut.profiles.v1";
const LS_ACTIVE = "bagrut.activeProfile.v1";

export function loadProfilesLocal(): Profile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LS_PROFILES);
    if (!raw) return [];
    return JSON.parse(raw) as Profile[];
  } catch {
    return [];
  }
}

export function saveProfilesLocal(profiles: Profile[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_PROFILES, JSON.stringify(profiles));
}

export function getActiveProfileId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(LS_ACTIVE);
}

export function setActiveProfileId(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) window.localStorage.setItem(LS_ACTIVE, id);
  else window.localStorage.removeItem(LS_ACTIVE);
}

/** Load profiles for the given uid (null = guest). Tries Firestore, falls back to localStorage. */
export async function loadProfiles(uid: string | null): Promise<Profile[]> {
  if (uid && isFirebaseConfigured) {
    try {
      const { db } = getFirebase();
      if (!db) return loadProfilesLocal();
      const col = collection(db, "users", uid, "profiles");
      const snap = await getDocs(col);
      const arr: Profile[] = [];
      snap.forEach((d) => arr.push(d.data() as Profile));
      // also cache locally for offline use
      saveProfilesLocal(arr);
      return arr;
    } catch (err) {
      console.warn("Firestore load failed, falling back to localStorage", err);
      return loadProfilesLocal();
    }
  }
  return loadProfilesLocal();
}

export async function saveProfile(uid: string | null, profile: Profile) {
  // always update local cache for instant UI
  const all = loadProfilesLocal();
  const idx = all.findIndex((p) => p.id === profile.id);
  if (idx >= 0) all[idx] = profile;
  else all.push(profile);
  saveProfilesLocal(all);

  if (uid && isFirebaseConfigured) {
    try {
      const { db } = getFirebase();
      if (!db) return;
      const ref = doc(db, "users", uid, "profiles", profile.id);
      await setDoc(ref, profile);
    } catch (err) {
      console.warn("Firestore save failed (kept locally)", err);
    }
  }
}

export async function deleteProfileLocal(profileId: string) {
  const all = loadProfilesLocal();
  saveProfilesLocal(all.filter((p) => p.id !== profileId));
  if (getActiveProfileId() === profileId) setActiveProfileId(null);
}
