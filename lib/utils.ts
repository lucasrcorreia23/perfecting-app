import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions from previous implementation
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getScoreColor(score: number): "success" | "warning" | "danger" {
  if (score >= 80) return "success";
  if (score >= 60) return "warning";
  return "danger";
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    behavioral: "#8B5CF6",
    technical: "#3B82F6",
    objection: "#F59E0B",
    closing: "#10B981",
    custom: "#6B7280",
  };
  return colors[category] || "#6B7280";
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    behavioral: "Comportamental",
    technical: "Técnico",
    objection: "Objeções",
    closing: "Fechamento",
    custom: "Personalizado",
  };
  return labels[category] || category;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
