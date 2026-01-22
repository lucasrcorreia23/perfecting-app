"use client";

import { useMemo } from "react";
import type { TranscriptEntry } from "@/types";
import { cn } from "@/lib/utils";

interface TranscriptViewerProps {
  transcript: TranscriptEntry[];
  searchQuery?: string;
  onEntryClick?: (entryId: string) => void;
}

export function TranscriptViewer({
  transcript,
  searchQuery = "",
  onEntryClick,
}: TranscriptViewerProps) {
  // Filtrar entradas baseado na busca
  const filteredTranscript = useMemo(() => {
    if (!searchQuery.trim()) {
      return transcript;
    }

    const query = searchQuery.toLowerCase();
    return transcript.filter((entry) =>
      entry.content.toLowerCase().includes(query)
    );
  }, [transcript, searchQuery]);

  // Função para destacar texto da busca
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) {
      return text;
    }

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark
          key={index}
          className="bg-[#FEF3C7] text-[#92400E] px-1 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (filteredTranscript.length === 0 && searchQuery.trim()) {
    return (
      <div className="text-center py-12">
        <p className="text-[#6B7280]">
          Nenhum resultado encontrado para "{searchQuery}"
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
      {filteredTranscript.map((entry) => (
        <div
          key={entry.id}
          className={cn(
            "p-4 rounded-xl transition-all duration-200",
            entry.speaker === "user"
              ? "bg-[#EBF0FA] ml-8"
              : "bg-[#F5F5F5] mr-8",
            onEntryClick && "cursor-pointer hover:shadow-md"
          )}
          onClick={() => onEntryClick?.(entry.id)}
          id={`transcript-${entry.id}`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-[#6B7280] uppercase tracking-wide font-medium">
              {entry.speaker === "user" ? "Você" : "Agente"}
            </p>
            <span className="text-xs text-[#9CA3AF]">
              {formatTime(entry.timestamp)}
            </span>
          </div>
          <p className="text-sm text-[#1F2937] leading-relaxed">
            {searchQuery ? highlightText(entry.content, searchQuery) : entry.content}
          </p>

          {/* Sentiment Indicator (opcional) */}
          {entry.sentiment && (
            <div className="mt-2 flex items-center gap-2">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  entry.sentiment === "positive" && "bg-[#10B981]",
                  entry.sentiment === "neutral" && "bg-[#6B7280]",
                  entry.sentiment === "negative" && "bg-[#EF4444]"
                )}
              />
              <span className="text-xs text-[#9CA3AF] capitalize">
                {entry.sentiment === "positive" && "Tom positivo"}
                {entry.sentiment === "neutral" && "Tom neutro"}
                {entry.sentiment === "negative" && "Tom negativo"}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
