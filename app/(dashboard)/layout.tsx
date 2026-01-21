"use client";

import { Sidebar } from "@/components/layout";

const mockUser = {
  name: "João Silva",
  email: "joao@empresa.com",
  avatar: "https://i.pravatar.cc/150?u=joao",
  role: "seller" as const,
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Sidebar variant="seller" user={mockUser} />
      <main className="pl-64 min-h-screen transition-all duration-300">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
 