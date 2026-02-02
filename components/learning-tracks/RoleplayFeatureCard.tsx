"use client";

import { Card } from "@heroui/react";
import { ClockIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import type { Roleplay } from "@/types";
import { getCategoryLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";

// Imagem mais viva e humana: conversa/reunião, contexto de roleplay/chamada
const DEFAULT_ROLEPLAY_COVER =
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=90&auto=format&fit=crop";

interface RoleplayFeatureCardProps {
  roleplay: Roleplay;
  /** Optional cover image URL. Falls back to default if not provided. */
  coverImage?: string;
}

/**
 * Card no estilo das trilhas de aprendizagem para exibir um roleplay em destaque.
 * Imagem de fundo, informações breves (título, descrição, duração, personagem) e sem CTA.
 */
export function RoleplayFeatureCard({ roleplay, coverImage }: RoleplayFeatureCardProps) {
  const imageSrc = coverImage || DEFAULT_ROLEPLAY_COVER;

  return (
    <Card className="bg-transparent rounded-2xl overflow-visible border-0 min-w-[280px] w-[280px]">
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-2xl",
          "shadow-[0_2px_8px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)]",
          "h-80 md:h-[360px]"
        )}
      >
        <Image
          src={imageSrc}
          alt={roleplay.title}
          fill
          className="object-cover"
          sizes="280px"
        />

        {/* Overlays leves: imagem mais visível, menos preto — contexto de chamada/roleplay */}
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 shadow-[inset_0_-80px_50px_-30px_rgba(0,0,0,0.6)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 via-transparent to-transparent" />

        {/* Tag e meta acima do título; depois título, descrição e contexto */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          {/* Tag (categoria) e meta acima do título */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-white/95 text-xs font-medium drop-shadow-md bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-md">
              {getCategoryLabel(roleplay.category)}
            </span>
            <div className="flex items-center gap-2 text-white text-xs font-semibold drop-shadow-md">
              <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-md">
                <ClockIcon className="w-3 h-3" />
                {roleplay.estimatedDuration} min
              </span>
              <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-md truncate max-w-[120px]" title={roleplay.agent.name}>
                <UserCircleIcon className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{roleplay.agent.name}</span>
              </span>
            </div>
          </div>

          <h3 className="font-bold text-white mb-1.5 line-clamp-2 drop-shadow-lg leading-tight text-base">
            {roleplay.title}
          </h3>

          <p className="text-white/95 mb-2 line-clamp-2 drop-shadow-md text-xs leading-snug">
            {roleplay.description}
          </p>

          <p className="text-white/90 text-xs drop-shadow-md line-clamp-1" title={roleplay.agent.context}>
            {roleplay.agent.role} — {roleplay.agent.context}
          </p>
        </div>
      </div>
    </Card>
  );
}
