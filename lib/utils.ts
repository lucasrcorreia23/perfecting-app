import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d atrás`;
  if (hours > 0) return `${hours}h atrás`;
  if (minutes > 0) return `${minutes}min atrás`;
  return "Agora";
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-[#10B981]";
  if (score >= 60) return "text-[#F59E0B]";
  return "text-[#EF4444]";
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    custom: "#8B5CF6",
    behavioral: "#2E63CD",
    technical: "#10B981",
    objection: "#F59E0B",
    closing: "#EF4444",
  };
  return colors[category] || "#6B7280";
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    custom: "Personalizado",
    behavioral: "Comportamental",
    technical: "Técnico",
    objection: "Objeções",
    closing: "Fechamento",
  };
  return labels[category] || category;
}

export function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    beginner: "Iniciante",
    intermediate: "Intermediário",
    advanced: "Avançado",
  };
  return labels[difficulty] || difficulty;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
