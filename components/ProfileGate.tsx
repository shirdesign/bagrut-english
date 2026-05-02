"use client";

import { useAuth } from "@/lib/auth";
import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

/**
 * Shows children only when an active profile is selected. Otherwise redirects
 * to the profile picker.
 */
export default function ProfileGate({ children }: { children: ReactNode }) {
  const { ready, activeProfile } = useAuth();
  const [shouldRender, setShouldRender] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!activeProfile) router.replace("/profile");
    else setShouldRender(true);
  }, [ready, activeProfile, router]);

  if (!ready)
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-500">
        <span className="animate-pulse">טוען...</span>
      </div>
    );
  if (!shouldRender) return null;
  return <>{children}</>;
}
