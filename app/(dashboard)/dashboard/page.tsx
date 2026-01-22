"use client";

import { Card, CardHeader, CardBody, Button, Chip, Progress, Avatar } from "@heroui/react";
import Link from "next/link";
import {
  PlayCircleIcon,
  TrophyIcon,
  ClockIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { RoleplayCard } from "@/components/roleplay";
import { mockRoleplays, mockUserMetrics, mockLeaderboard } from "@/lib/mock-data";
import { cn, getScoreColor } from "@/lib/utils";

export default function DashboardPage() {
  const recentRoleplays = mockRoleplays.slice(0, 3);
  const topLeaderboard = mockLeaderboard.slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="heading-2">Bem-vindo de volta, João!</h1>
          <p className="text-[#6B7280] mt-1">
            Continue seu treinamento e melhore suas habilidades de vendas.
          </p>
        </div>
        <Link
          href="/roleplays"
          className="inline-flex items-center justify-center px-4 py-2 bg-[#2E63CD] hover:bg-[#2451A8] text-white font-medium rounded-lg transition-colors"
        >
          Iniciar Prática
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#EBF0FA] flex items-center justify-center">
                <PlayCircleIcon className="w-6 h-6 text-[#2E63CD]" />
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Sessões Totais</p>
                <p className="text-2xl font-semibold text-[#111827]">
                  {mockUserMetrics.totalSessions}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] flex items-center justify-center">
                <TrophyIcon className="w-6 h-6 text-[#10B981]" />
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Pontuação Média</p>
                <p className={cn("text-2xl font-semibold", getScoreColor(mockUserMetrics.averageScore))}>
                  {mockUserMetrics.averageScore}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Tempo de Prática</p>
                <p className="text-2xl font-semibold text-[#111827]">
                  {Math.floor(mockUserMetrics.totalPracticeTime / 60)}h
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FEE2E2] flex items-center justify-center">
                <FireIcon className="w-6 h-6 text-[#EF4444]" />
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Sequência</p>
                <p className="text-2xl font-semibold text-[#111827]">
                  {mockUserMetrics.streakDays} dias
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent roleplays */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="heading-3">Role-plays Sugeridos</h2>
            <Link
              href="/roleplays"
              className="text-sm text-[#2E63CD] hover:text-[#2451A8] font-medium flex items-center gap-1"
            >
              Ver todos
              <ChevronRightIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {recentRoleplays.map((roleplay) => (
              <RoleplayCard
                key={roleplay.id}
                roleplay={roleplay}
                onPractice={() => window.location.href = `/roleplays/scenario/${roleplay.scenarioSlug}`}
              />
            ))}
          </div>

          {/* Weekly progress */}
          <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
            <CardHeader className="px-6 py-4 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <ArrowTrendingUpIcon className="w-5 h-5 text-[#2E63CD]" />
                <h3 className="text-lg font-semibold text-[#111827]">
                  Progresso Semanal
                </h3>
              </div>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-4">
                {mockUserMetrics.weeklyProgress.map((week, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6B7280]">{week.week}</span>
                      <span className="font-medium text-[#1F2937]">
                        {week.sessions} sessões • {week.averageScore} pts
                      </span>
                    </div>
                    <Progress
                      value={week.averageScore}
                      maxValue={100}
                      color={week.averageScore >= 80 ? "success" : week.averageScore >= 60 ? "warning" : "danger"}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar content */}
        <div className="space-y-6">
          {/* Leaderboard */}
          <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
            <CardHeader className="px-6 py-4 border-b border-[#E5E7EB]">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <TrophyIcon className="w-5 h-5 text-[#F59E0B]" />
                  <h3 className="text-lg font-semibold text-[#111827]">Ranking</h3>
                </div>
                <Link
                  href="/ranking"
                  className="text-sm text-[#2E63CD] hover:text-[#2451A8]"
                >
                  Ver mais
                </Link>
              </div>
            </CardHeader>
            <CardBody className="p-4">
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

          {/* Badges */}
          <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
            <CardHeader className="px-6 py-4 border-b border-[#E5E7EB]">
              <h3 className="text-lg font-semibold text-[#111827]">Suas Conquistas</h3>
            </CardHeader>
            <CardBody className="p-4">
              <div className="flex flex-wrap gap-3">
                {mockUserMetrics.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5F5] hover:bg-[#E5E7EB] transition-colors cursor-pointer"
                    title={badge.description}
                  >
                    <span className="text-xl">{badge.icon}</span>
                    <span className="text-sm font-medium text-[#1F2937]">
                      {badge.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
