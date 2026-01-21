"use client";

import { Sidebar } from "@/components/layout";

const mockAdmin = {
  name: "Admin User",
  email: "admin@empresa.com",
  avatar: "https://i.pravatar.cc/150?u=admin",
  role: "admin" as const,
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Sidebar variant="admin" user={mockAdmin} />
      <main className="pl-64 min-h-screen transition-all duration-300">
        <div className="p-9">{children}</div>
      </main>
    </div>
  );
}
 