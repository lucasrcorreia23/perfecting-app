"use client";

import { useAuth } from "@/contexts";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (!isAdmin) {
      // If user is not an admin, redirect to dashboard
      router.push("/dashboard");
    }
  }, [user, isAdmin, router]);

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  );
}
