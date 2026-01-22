"use client";

import { Sidebar } from "@/components/layout";
import { useAuth } from "@/contexts";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  // Proteção de rotas - redirecionar se não estiver logado
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null; // Ou loading spinner
  }

  const sidebarUser = {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
  };

  // Usar o papel real do usuário - Admin mantém permissões em todos os módulos
  const variant = user.role;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Sidebar variant={variant} user={sidebarUser} />
      <main className="pl-64 min-h-screen transition-all duration-300">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
 