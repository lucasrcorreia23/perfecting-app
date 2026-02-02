"use client";

import { Card } from "@heroui/react";
import { ClockIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { LearningTrack } from "@/types";
import { getCategoryById } from "@/lib/learning-tracks-data";
import { cn } from "@/lib/utils";

interface TrackCardProps {
  track: LearningTrack;
  variant?: "default" | "compact";
  onSelect?: (track: LearningTrack) => void;
  showProgress?: boolean;
  isDragging?: boolean;
}


export function TrackCard({
  track,
  variant = "default",
  onSelect,
  showProgress = false,
  isDragging = false,
}: TrackCardProps) {
  const isCompact = variant === "compact";
  const progress = track.progress ?? 0;
  const category = getCategoryById(track.categoryId);

  return (
    <Card
      className={cn(
        "bg-transparent rounded-2xl overflow-visible border-0",
        isCompact ? "min-w-[280px] w-[280px]" : "w-full"
      )}
    >
      {/* Cover image - clickable area */}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-2xl",
          "shadow-[0_2px_8px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)]",
          "transition-all duration-300",
          isDragging ? "cursor-grabbing" : "cursor-grab",
          isCompact ? "h-80 md:h-[360px]" : "h-[360px]"
        )}
        onClick={() => {
          if (!isDragging) {
            onSelect?.(track);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`Ver detalhes da trilha ${track.title}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect?.(track);
          }
        }}
      >
        {/* Image */}
        <Image
          src={track.coverImage}
          alt={track.title}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes={isCompact ? "280px" : "(max-width: 768px) 100vw, 400px"}
        />

        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Inner shadow overlay for depth */}
        <div className="absolute inset-0 shadow-[inset_0_-100px_70px_-50px_rgba(0,0,0,0.85)]" />

        {/* Enhanced gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 via-black/25 to-transparent" />

        {/* Tag, meta, title and description overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          {/* Tag (categoria) e meta acima do título */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {category && (
              <span className="text-white/95 text-xs font-medium drop-shadow-md bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-md">
                {category.name}
              </span>
            )}
            <div className="flex items-center gap-2 text-white text-xs font-semibold drop-shadow-md">
              <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-md">
                <ClockIcon className="w-3 h-3" />
                {track.estimatedTime}
              </span>
              <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-md">
                <AcademicCapIcon className="w-3 h-3" />
                {track.modules.length} módulos
              </span>
            </div>
          </div>

          <h3 className={cn(
            "font-bold text-white mb-2 line-clamp-2 drop-shadow-lg leading-tight",
            isCompact ? "text-base" : "text-lg"
          )}>
            {track.title}
          </h3>
          
          {/* Description */}
          <p className={cn(
            "text-white/90 mb-3 line-clamp-2 drop-shadow-md",
            isCompact ? "text-xs" : "text-sm"
          )}>
            {track.description}
          </p>

          {/* Progress bar - só aparece se a trilha foi iniciada (progress > 0) */}
          {showProgress && progress > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1.5 text-white drop-shadow-md">
                <span className="font-medium">Progresso</span>
                <span className="font-bold">{progress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#E5E7EB] overflow-hidden">
                <div 
                  className="h-full rounded-full bg-[#60A5FA] transition-all duration-300" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
