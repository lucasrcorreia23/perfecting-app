"use client";

import { Sidebar } from "@/components/layout";
import { useAuth } from "@/contexts";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  const sidebarUser = user ? {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
  } : {
    name: "Vendedor",
    email: "vendedor@empresa.com",
    role: "seller" as const,
  };

  // Admin users accessing dashboard routes still see seller variant
  const variant = "seller";

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Sidebar variant={variant} user={sidebarUser} />
      <main className="pl-64 min-h-screen transition-all duration-300">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
 