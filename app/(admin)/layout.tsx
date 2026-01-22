"use client";

import { Sidebar } from "@/components/layout";
import { useAuth } from "@/contexts";

export default function AdminLayout({
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
    name: "Administrador",
    email: "admin@empresa.com",
    role: "admin" as const,
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Sidebar variant="admin" user={sidebarUser} />
      <main className="pl-64 min-h-screen transition-all duration-300">
        <div className="p-9">{children}</div>
      </main>
    </div>
  );
}
 