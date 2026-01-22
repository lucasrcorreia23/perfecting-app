"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role?: "admin" | "seller") => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isSeller: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for simulation
const mockUsers: Record<string, User> = {
  "admin@perfecting.com": {
    id: "1",
    email: "admin@perfecting.com",
    name: "Admin",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  "vendedor@perfecting.com": {
    id: "2",
    email: "vendedor@perfecting.com",
    name: "João Silva",
    role: "seller",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string, role?: "admin" | "seller") => {
    try {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Check if email exists in mock users
      let loggedUser = mockUsers[email.toLowerCase()];

      // If not found, create a new user with the specified role
      if (!loggedUser) {
        loggedUser = {
          id: Date.now().toString(),
          email: email.toLowerCase(),
          name: email.split("@")[0],
          role: role || "seller",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      // Override role if specified (for demo purposes)
      if (role) {
        loggedUser = { ...loggedUser, role };
      }

      setUser(loggedUser);
      
      // Stop loading BEFORE redirect to prevent state update after unmount
      setIsLoading(false);

      // Small delay to ensure state is updated
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Redirect based on role
      if (loggedUser.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    router.push("/login");
  }, [router]);

  const isAdmin = user?.role === "admin";
  const isSeller = user?.role === "seller";

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAdmin, isSeller }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
