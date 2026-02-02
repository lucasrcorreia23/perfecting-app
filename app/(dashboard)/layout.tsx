"use client";

import { Sidebar, ContentHeader } from "@/components/layout";
import { useAuth } from "@/contexts";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      {/* Mobile header */}
      <ContentHeader
        user={sidebarUser}
        isMobile={true}
        onMenuOpen={() => setIsSidebarOpen(true)}
      />

      <Sidebar
        variant={variant}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="lg:pl-64 min-h-screen transition-all duration-300">
        {/* Desktop header */}
        <ContentHeader user={sidebarUser} />
        <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-6">{children}</div>
      </main>
    </div>
  );
}
 