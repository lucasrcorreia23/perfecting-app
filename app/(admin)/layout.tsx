"use client";

import { Sidebar } from "@/components/layout";
import { useAuth } from "@/contexts";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  // Proteção de rotas - apenas admin pode acessar
  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (!isAdmin) {
      // Usuário vendedor tentando acessar admin, redirecionar para dashboard
      router.push("/dashboard");
    }
  }, [user, isAdmin, router]);

  if (!user || !isAdmin) {
    return null;
  }

  const sidebarUser = {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Sidebar variant="admin" user={sidebarUser} />
      <main className="pl-64 min-h-screen transition-all duration-300">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
 