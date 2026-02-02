"use client";

import { Sidebar, ContentHeader } from "@/components/layout";
import { useAuth } from "@/contexts";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const headerUser = {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Mobile header */}
      <ContentHeader
        user={headerUser}
        isMobile={true}
        onMenuOpen={() => setIsSidebarOpen(true)}
      />

      <Sidebar
        variant="admin"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="lg:pl-64 min-h-screen transition-all duration-300">
        {/* Desktop header */}
        <ContentHeader user={headerUser} />
        <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-6">{children}</div>
      </main>
    </div>
  );
}
 