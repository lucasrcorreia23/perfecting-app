"use client";

import { Card, CardBody, CardHeader, Progress, Chip, Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import {
  ChartBarIcon,
  TrophyIcon,
  ClockIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { mockUserMetrics, mockFeedback } from "@/lib/mock-data";
import { cn, getScoreColor, formatDuration } from "@/lib/utils";

const timeRanges = [
  { value: "7d", label: "Últimos 7 dias" },
  { value: "30d", label: "Últimos 30 dias" },
  { value: "90d", label: "Últimos 90 dias" },
  { value: "all", label: "Todo o período" },
];

export default function MetricsPage() {
  const [timeRange, setTimeRange] = useState("30d");

  // Calculate improvement
  const firstWeekScore = mockUserMetrics.weeklyProgress[0]?.averageScore || 0;
  const lastWeekScore = mockUserMetrics.weeklyProgress[mockUserMetrics.weeklyProgress.length - 1]?.averageScore || 0;
  const improvement = lastWeekScore - firstWeekScore;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="heading-2">Minhas Métricas</h1>
          <p className="text-[#6B7280] mt-1">
            Acompanhe seu progresso e identifique áreas de melhoria
          </p>
        </div>

        <Select
          selectedKeys={[timeRange]}
          onSelectionChange={(keys) => setTimeRange(Array.from(keys)[0] as string)}
          variant="bordered"
          classNames={{
            base: "w-48",
            trigger: "border-[#E5E7EB] hover:border-[#2E63CD]",
          }}
          startContent={<CalendarIcon className="w-4 h-4 text-[#6B7280]" />}
        >
          {timeRanges.map((range) => (
            <SelectItem key={range.value}>{range.label}</SelectItem>
          ))}
        </Select>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280]">Sessões Completas</p>
                <p className="text-3xl font-bold text-[#111827] mt-1">
                  {mockUserMetrics.completedSessions}
                </p>
                <p className="text-xs text-[#6B7280] mt-1">
                  de {mockUserMetrics.totalSessions} iniciadas
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#EBF0FA] flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-[#2E63CD]" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280]">Pontuação Média</p>
                <p className={cn("text-3xl font-bold mt-1", getScoreColor(mockUserMetrics.averageScore))}>
                  {mockUserMetrics.averageScore}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {improvement >= 0 ? (
                    <ArrowTrendingUpIcon className="w-4 h-4 text-[#10B981]" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-4 h-4 text-[#EF4444]" />
                  )}
                  <span className={cn("text-xs", improvement >= 0 ? "text-[#10B981]" : "text-[#EF4444]")}>
                    {improvement >= 0 ? "+" : ""}{improvement} pts
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] flex items-center justify-center">
                <TrophyIcon className="w-6 h-6 text-[#10B981]" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280]">Tempo de Prática</p>
                <p className="text-3xl font-bold text-[#111827] mt-1">
                  {Math.floor(mockUserMetrics.totalPracticeTime / 60)}h {mockUserMetrics.totalPracticeTime % 60}min
                </p>
                <p className="text-xs text-[#6B7280] mt-1">
                  ~{Math.round(mockUserMetrics.totalPracticeTime / mockUserMetrics.completedSessions)} min/sessão
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-[#F59E0B]" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280]">Sequência Atual</p>
                <p className="text-3xl font-bold text-[#111827] mt-1">
                  {mockUserMetrics.streakDays} dias
                </p>
                <p className="text-xs text-[#6B7280] mt-1">
                  Continue praticando!
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#FEE2E2] flex items-center justify-center">
                <FireIcon className="w-6 h-6 text-[#EF4444]" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly progress chart */}
        <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
          <CardHeader className="px-6 py-4 border-b border-[#E5E7EB]">
            <h3 className="text-lg font-semibold text-[#111827]">
              Evolução Semanal
            </h3>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-6">
              {mockUserMetrics.weeklyProgress.map((week, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B7280]">{week.week}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-[#6B7280]">{week.sessions} sessões</span>
                      <span className={cn("font-semibold", getScoreColor(week.averageScore))}>
                        {week.averageScore} pts
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <Progress
                      value={week.averageScore}
                      maxValue={100}
                      color={week.averageScore >= 80 ? "success" : week.averageScore >= 60 ? "warning" : "danger"}
                      className="h-3"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Skills breakdown */}
        <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
          <CardHeader className="px-6 py-4 border-b border-[#E5E7EB]">
            <h3 className="text-lg font-semibold text-[#111827]">
              Habilidades por Categoria
            </h3>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-6">
              {mockFeedback.categories.map((category, index) => {
                const percentage = (category.score / category.maxScore) * 100;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-[#1F2937]">{category.name}</span>
                      <span className={cn("font-semibold", getScoreColor(percentage))}>
                        {category.score}/{category.maxScore}
                      </span>
                    </div>
                    <Progress
                      value={percentage}
                      maxValue={100}
                      color={percentage >= 80 ? "success" : percentage >= 60 ? "warning" : "danger"}
                      className="h-2"
                    />
                    <p className="text-xs text-[#6B7280]">{category.feedback}</p>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Badges section */}
      <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
        <CardHeader className="px-6 py-4 border-b border-[#E5E7EB]">
          <h3 className="text-lg font-semibold text-[#111827]">
            Conquistas Desbloqueadas
          </h3>
        </CardHeader>
        <CardBody className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockUserMetrics.badges.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#F5F5F5] hover:bg-[#E5E7EB] transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-2xl">
                  {badge.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#111827]">{badge.name}</p>
                  <p className="text-sm text-[#6B7280] truncate">{badge.description}</p>
                  <p className="text-xs text-[#6B7280] mt-1">
                    {badge.earnedAt.toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            ))}

            {/* Locked badges */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F5F5F5] opacity-50">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl border border-[#E5E7EB]">
                🔒
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#111827]">Maratonista</p>
                <p className="text-sm text-[#6B7280]">Complete 100 sessões</p>
                <Chip size="sm" variant="flat" className="mt-1">
                  58/100
                </Chip>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F5F5F5] opacity-50">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl border border-[#E5E7EB]">
                🔒
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#111827]">Perfeccionista</p>
                <p className="text-sm text-[#6B7280]">Score 95+ em 10 sessões</p>
                <Chip size="sm" variant="flat" className="mt-1">
                  3/10
                </Chip>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Recent sessions */}
      <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
        <CardHeader className="px-6 py-4 border-b border-[#E5E7EB]">
          <h3 className="text-lg font-semibold text-[#111827]">
            Sessões Recentes
          </h3>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-[#E5E7EB]">
            {[
              { title: "Primeira Abordagem: Decisor de TI", score: 82, date: "Hoje, 14:30", duration: "12 min" },
              { title: "Lidando com Objeção de Preço", score: 75, date: "Ontem, 10:15", duration: "15 min" },
              { title: "Demonstração de Produto SaaS", score: 88, date: "22 Jan, 16:45", duration: "18 min" },
              { title: "Fechamento: Proposta Final", score: 71, date: "21 Jan, 09:30", duration: "14 min" },
              { title: "Recuperação de Lead Frio", score: 79, date: "20 Jan, 11:00", duration: "10 min" },
            ].map((session, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 hover:bg-[#F5F5F5] transition-colors cursor-pointer"
              >
                <div>
                  <p className="font-medium text-[#1F2937]">{session.title}</p>
                  <p className="text-sm text-[#6B7280]">{session.date} • {session.duration}</p>
                </div>
                <Chip
                  color={session.score >= 80 ? "success" : session.score >= 60 ? "warning" : "danger"}
                  variant="flat"
                >
                  {session.score} pts
                </Chip>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
 