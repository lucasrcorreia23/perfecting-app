"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody, Button, Chip, Avatar, Tooltip } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PlayCircleIcon,
  TrophyIcon,
  ClockIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import { RoleplayCard } from "@/components/roleplay";
import { TrackCard, TrackDetailsModal, RoleplayFeatureCard } from "@/components/learning-tracks";
import { mockRoleplays, mockUserMetrics, mockLeaderboard } from "@/lib/mock-data";
import { getRecommendedTracks } from "@/lib/learning-tracks-data";
import { cn, getScoreColor } from "@/lib/utils";
import { useAuth } from "@/contexts";
import { ProgressBar } from "@/components/ui";
import { LearningTrack, LearningModule, Roleplay } from "@/types";

type NextActivityItem =
  | { type: "track"; track: LearningTrack }
  | { type: "roleplay"; roleplay: Roleplay };

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const recentRoleplays = mockRoleplays.slice(0, 3);
  const topLeaderboard = mockLeaderboard.slice(0, 5);
  const firstName = user?.name?.split(" ")[0] || "Vendedor";
  const recommendedTracks = getRecommendedTracks(5);

  const [selectedTrack, setSelectedTrack] = useState<LearningTrack | null>(null);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);

  const handleTrackSelect = (track: LearningTrack) => {
    setSelectedTrack(track);
    setIsTrackModalOpen(true);
  };

  const handleCloseTrackModal = () => {
    setIsTrackModalOpen(false);
    setSelectedTrack(null);
  };

  const handleStartModule = (track: LearningTrack, module: LearningModule) => {
    if (module.scenarioSlug && module.characterId) {
      router.push(
        `/roleplays/scenario/${module.scenarioSlug}?character=${module.characterId}&trackId=${track.id}`
      );
    }
  };

  const featuredRoleplay = mockRoleplays[0];
  const displayItems: NextActivityItem[] = [
    ...recommendedTracks.slice(0, 2).map((track) => ({ type: "track" as const, track })),
    ...(featuredRoleplay ? [{ type: "roleplay" as const, roleplay: featuredRoleplay }] : []),
  ];

  return (
    <div className="w-full max-w-full space-y-6 md:space-y-8 animate-fade-in min-w-0">
      {/* Welcome section */}
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827] leading-tight">Bem-vindo de volta, {firstName}!</h1>
        <p className="text-sm sm:text-base text-[#6B7280] mt-2">
          Continue seu treinamento e melhore suas habilidades de vendas.
        </p>
      </div>


      {/* Próximas atividades: até 3 cards em grid | Conquistas (mesma altura) */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 sm:gap-8 items-stretch">
        {/* Coluna esquerda: título + grid de cards */}
        <div className="flex flex-col min-h-0">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#111827] mb-3 sm:mb-4">Próximas atividades</h2>
          {/* Mobile: carrossel scrollável (1 card por vez). Desktop: grid */}
          <div
            className="flex md:grid md:grid-cols-2 xl:grid-cols-3 overflow-x-auto md:overflow-visible gap-4 sm:gap-6 flex-1 min-h-0 w-full max-w-full snap-x snap-mandatory md:snap-none pb-2 md:pb-0 scroll-smooth"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {displayItems.map((item) =>
              item.type === "track" ? (
                <div
                  key={item.track.id}
                  className="flex-shrink-0 md:flex-shrink min-w-0 snap-center w-[85vw] sm:w-[75vw] md:w-auto max-w-[320px] md:max-w-none"
                >
                  <TrackCard
                    track={item.track}
                    variant="compact"
                    onSelect={handleTrackSelect}
                    showProgress={true}
                  />
                </div>
              ) : (
                <div
                  key={item.roleplay.id}
                  className="flex-shrink-0 md:flex-shrink min-w-0 snap-center w-[85vw] sm:w-[75vw] md:w-auto max-w-[320px] md:max-w-none"
                >
                  <RoleplayFeatureCard roleplay={item.roleplay} />
                </div>
              )
            )}
          </div>
        </div>

        {/* Suas Conquistas - ativas + desativadas (o que ainda pode conquistar) */}
        <Card className="bg-white border border-[#E5E7EB] rounded-2xl flex flex-col flex-shrink-0 h-full w-full min-w-0">
          <CardHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#E5E7EB]">
            <h3 className="text-base sm:text-lg font-semibold text-[#111827]">Suas Conquistas</h3>
          </CardHeader>
          <CardBody className="p-3 sm:p-4 flex-1">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {mockUserMetrics.badges.map((badge) => (
                <Tooltip
                  key={badge.id}
                  classNames={{
                    content: "bg-[#1F2937] text-white px-3 py-2 rounded-lg shadow-lg border border-[#374151]",
                  }}
                  content={
                    <div>
                      <p className="font-semibold text-xs text-[#10B981]">Desbloqueada</p>
                      <p className="text-xs text-white/90 mt-0.5">{badge.description}</p>
                    </div>
                  }
                >
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5F5] hover:bg-[#E5E7EB] transition-colors cursor-pointer">
                    <span className="text-xl">{badge.icon}</span>
                    <span className="text-sm font-medium text-[#1F2937]">
                      {badge.name}
                    </span>
                  </div>
                </Tooltip>
              ))}
              {mockUserMetrics.lockedBadges?.map((badge) => (
                <Tooltip
                  key={badge.id}
                  classNames={{
                    content: "bg-[#1F2937] text-white px-3 py-2 rounded-lg shadow-lg border border-[#374151]",
                  }}
                  content={
                    <div>
                      <p className="font-semibold text-xs text-[#9CA3AF]">Bloqueada</p>
                      <p className="text-xs text-white/90 mt-0.5">{badge.description}</p>
                    </div>
                  }
                >
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F9FAFB] border border-dashed border-[#E5E7EB] opacity-60 cursor-default">
                    <span className="text-xl grayscale">{badge.icon}</span>
                    <span className="text-sm font-medium text-[#9CA3AF]">
                      {badge.name}
                    </span>
                  </div>
                </Tooltip>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Próximas atividades - largura até encostar em Ranking (mesma linha lógica) */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#111827]">Roleplays disponíveis</h2>
          <Link
            href="/roleplays"
            className="text-sm text-[#2E63CD] hover:text-[#2451A8] font-medium self-start sm:self-auto"
          >
            Ver todos
          </Link>
        </div>

        {/* Mobile: carrossel scrollável (1 card por vez). Desktop: grid */}
        <div
          className="flex md:grid md:grid-cols-2 xl:grid-cols-3 overflow-x-auto md:overflow-visible gap-4 sm:gap-6 snap-x snap-mandatory md:snap-none pb-2 scroll-smooth"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {recentRoleplays.map((roleplay) => (
            <div
              key={roleplay.id}
              className="flex-shrink-0 md:flex-shrink min-w-0 snap-center w-[85vw] sm:w-[75vw] md:w-auto max-w-[360px] md:max-w-none"
            >
              <RoleplayCard
                roleplay={roleplay}
                onPractice={() => router.push(`/roleplays/scenario/${roleplay.scenarioSlug}?character=${roleplay.agent.id}`)}
                onView={() => router.push(`/roleplays/${roleplay.id}/analytics`)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Terceira linha: Ranking | Progresso Semanal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Ranking */}
        <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
          <CardHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#E5E7EB]">
            <div className="flex items-center justify-between w-full gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <TrophyIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#F59E0B] flex-shrink-0" />
                <h3 className="text-base sm:text-lg font-semibold text-[#111827] truncate">Ranking</h3>
              </div>
              <Link
                href="/ranking"
                className="text-xs sm:text-sm text-[#2E63CD] hover:text-[#2451A8] flex-shrink-0"
              >
                Ver mais
              </Link>
            </div>
          </CardHeader>
          <CardBody className="p-3 sm:p-4">
            <div className="space-y-3">
              {topLeaderboard.map((entry, index) => (
                <div
                  key={entry.userId}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg transition-colors",
                    index === 0 && "bg-[#FEF3C7]",
                    index === 1 && "bg-[#F3F4F6]",
                    index === 2 && "bg-[#FED7AA]"
                  )}
                >
                  <span
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                      index === 0 && "bg-[#F59E0B] text-white",
                      index === 1 && "bg-[#6B7280] text-white",
                      index === 2 && "bg-[#CD7F32] text-white",
                      index > 2 && "bg-[#E5E7EB] text-[#6B7280]"
                    )}
                  >
                    {entry.rank}
                  </span>
                  <Avatar
                    src={entry.userAvatar}
                    name={entry.userName}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1F2937] truncate">
                      {entry.userName}
                    </p>
                    <p className="text-xs text-[#6B7280]">
                      {entry.sessionsCompleted} sessões
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#111827]">
                      {entry.score}
                    </p>
                    <Chip
                      size="sm"
                      variant="flat"
                      color="success"
                      className="text-xs"
                    >
                      +{entry.improvement}%
                    </Chip>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Progresso Semanal */}
        <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
          <CardHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2">
            
              <h3 className="text-base sm:text-lg font-semibold text-[#111827]">
                Progresso Semanal
              </h3>
            </div>
          </CardHeader>
          <CardBody className="p-4 sm:p-6">
            <div className="space-y-4">
              {mockUserMetrics.weeklyProgress.map((week, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B7280]">{week.week}</span>
                    <span className="font-medium text-[#1F2937]">
                      {week.sessions} sessões • {week.averageScore} pts
                    </span>
                  </div>
                  <ProgressBar
                    value={week.averageScore}
                    color={week.averageScore >= 80 ? "success" : week.averageScore >= 60 ? "warning" : "danger"}
                    size="sm"
                  />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Track Details Modal */}
      <TrackDetailsModal
        track={selectedTrack}
        isOpen={isTrackModalOpen}
        onClose={handleCloseTrackModal}
        onStartModule={handleStartModule}
      />
    </div>
  );
}
