"use client";

import { Card, CardHeader, CardBody, Button, Chip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Avatar, Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import Link from "next/link";
import {
  UsersIcon,
  PlayCircleIcon,
  ChartBarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  PlusIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { mockLeaderboard, mockRoleplays } from "@/lib/mock-data";
import { cn, getScoreColor } from "@/lib/utils";
import { ProgressBar } from "@/components/ui";

const timeRanges = [
  { value: "7d", label: "Últimos 7 dias" },
  { value: "30d", label: "Últimos 30 dias" },
  { value: "90d", label: "Últimos 90 dias" },
];

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState("30d");

  // Mock stats
  const stats = {
    totalUsers: 48,
    activeUsers: 35,
    totalSessions: 1240,
    avgScore: 76,
    totalPracticeHours: 412,
    sessionsThisWeek: 156,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="heading-3">Dashboard Administrativo</h1>
          <p className="text-[#6B7280] mt-1">
            Gerencie sua equipe e acompanhe o progresso dos treinamentos
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select
            selectedKeys={new Set([timeRange])}
            onSelectionChange={(keys) => setTimeRange(Array.from(keys)[0] as string)}
            className="w-44 focus:outline-none"
            aria-label="Período"
            variant="bordered"
            radius="lg"
            classNames={{
              trigger: "bg-white border-2 border-[#E5E7EB] hover:border-[#D1D5DB] data-[focus=true]:border-[#2E63CD] data-[focus=true]:bg-[#EBF0FA] data-[open=true]:border-[#2E63CD] data-[open=true]:bg-[#EBF0FA] rounded-xl shadow-none transition-all duration-200 min-h-[48px] focus:outline-none focus:ring-0",
              value: "text-[#1F2937] font-medium",
              innerWrapper: "py-2",
              popoverContent: "rounded-xl shadow-none",
            }}
            popoverProps={{
              classNames: {
                content: "rounded-xl shadow-none border border-[#E5E7EB]",
              },
            }}
          >
            {timeRanges.map((range) => (
              <SelectItem key={range.value}>{range.label}</SelectItem>
            ))}
          </Select>
          <Link
            href="/roleplays/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2E63CD] hover:bg-[#2451A8] text-white font-medium rounded-xl shadow-none transition-all duration-200 min-h-[48px]"
          >
            <PlusIcon className="w-5 h-5" />
            Criar Role-play
          </Link>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
          <CardBody className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#EBF0FA] flex items-center justify-center">
                <UsersIcon className="w-5 h-5 text-[#2E63CD]" />
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Usuários</p>
                <p className="text-xl font-bold text-[#111827]">{stats.totalUsers}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
          <CardBody className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#ECFDF5] flex items-center justify-center">
                <UsersIcon className="w-5 h-5 text-[#10B981]" />
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Ativos</p>
                <p className="text-xl font-bold text-[#111827]">{stats.activeUsers}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
          <CardBody className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
                <PlayCircleIcon className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Sessões</p>
                <p className="text-xl font-bold text-[#111827]">{stats.totalSessions}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
          <CardBody className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#EDE9FE] flex items-center justify-center">
                <ChartBarIcon className="w-5 h-5 text-[#8B5CF6]" />
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Score Médio</p>
                <p className={cn("text-xl font-bold", getScoreColor(stats.avgScore))}>
                  {stats.avgScore}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
          <CardBody className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FEE2E2] flex items-center justify-center">
                <ClockIcon className="w-5 h-5 text-[#EF4444]" />
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Horas Totais</p>
                <p className="text-xl font-bold text-[#111827]">{stats.totalPracticeHours}h</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
          <CardBody className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#DBEAFE] flex items-center justify-center">
                <ArrowTrendingUpIcon className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Esta Semana</p>
                <p className="text-xl font-bold text-[#111827]">{stats.sessionsThisWeek}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Team performance */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
            <CardHeader className="px-6 py-4 border-b border-[#E5E7EB]">
              <div className="flex items-center justify-between w-full">
                <h3 className="text-lg font-semibold text-[#111827]">
                  Desempenho da Equipe
                </h3>
                <Link
                  href="/users"
                  className="text-sm text-[#2E63CD] hover:text-[#2451A8] flex items-center gap-1"
                >
                  Ver todos
                  <ChevronRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <Table
                aria-label="Tabela de desempenho da equipe"
                className="w-full"
              >
                <TableHeader>
                  <TableColumn>MEMBRO</TableColumn>
                  <TableColumn>SESSÕES</TableColumn>
                  <TableColumn>SCORE MÉDIO</TableColumn>
                  <TableColumn>PROGRESSO</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                </TableHeader>
                <TableBody>
                  {mockLeaderboard.slice(0, 5).map((user) => (
                    <TableRow key={user.userId}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={user.userName}
                            size="sm"
                          />
                          <span className="font-medium text-[#1F2937]">
                            {user.userName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-[#6B7280]">
                          {user.sessionsCompleted}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={cn("font-semibold", getScoreColor(user.score))}>
                          {user.score}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ProgressBar
                            value={user.score}
                            color={user.score >= 80 ? "success" : user.score >= 60 ? "warning" : "danger"}
                            size="sm"
                            className="max-w-24"
                          />
                          <Chip
                            size="sm"
                            color="success"
                            variant="flat"
                          >
                            +{user.improvement}%
                          </Chip>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          variant="flat"
                          color="success"
                        >
                          Ativo
                        </Chip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>

          {/* Role-plays management */}
          <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
            <CardHeader className="px-6 py-4 border-b border-[#E5E7EB]">
              <div className="flex items-center justify-between w-full">
                <h3 className="text-lg font-semibold text-[#111827]">
                  Role-plays Ativos
                </h3>
                <Link
                  href="/roleplays"
                  className="text-sm text-[#2E63CD] hover:text-[#2451A8] flex items-center gap-1"
                >
                  Ver todos
                  <ChevronRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-[#E5E7EB]">
                {mockRoleplays.slice(0, 4).map((roleplay) => (
                  <div
                    key={roleplay.id}
                    className="flex items-center justify-between p-4 hover:bg-[#F5F5F5] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar
                        name={roleplay.agent.name}
                        size="sm"
                      />
                      <div>
                        <p className="font-medium text-[#1F2937]">{roleplay.title}</p>
                        <p className="text-sm text-[#6B7280]">{roleplay.agent.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-[#1F2937]">
                          {Math.floor(Math.random() * 50) + 10} sessões
                        </p>
                        <p className="text-xs text-[#6B7280]">esta semana</p>
                      </div>
                      <Chip
                        size="sm"
                        variant="flat"
                        color="success"
                      >
                        Ativo
                      </Chip>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick actions */}
          <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
            <CardHeader className="px-6 py-4 border-b border-[#E5E7EB]">
              <h3 className="text-lg font-semibold text-[#111827]">
                Ações Rápidas
              </h3>
            </CardHeader>
            <CardBody className="p-4 space-y-2">
              <Link
                href="/users"
                className="flex items-center gap-2 w-full px-4 py-2 rounded-lg hover:bg-[#F5F5F5] text-[#1F2937] transition-colors"
              >
                <UsersIcon className="w-5 h-5 text-[#6B7280]" />
                Gerenciar Usuários
              </Link>
              <Link
                href="/roleplays"
                className="flex items-center gap-2 w-full px-4 py-2 rounded-lg hover:bg-[#F5F5F5] text-[#1F2937] transition-colors"
              >
                <PlayCircleIcon className="w-5 h-5 text-[#6B7280]" />
                Ver Role-plays
              </Link>
              <Link
                href="/metrics"
                className="flex items-center gap-2 w-full px-4 py-2 rounded-lg hover:bg-[#F5F5F5] text-[#1F2937] transition-colors"
              >
                <ChartBarIcon className="w-5 h-5 text-[#6B7280]" />
                Ver Métricas
              </Link>
            </CardBody>
          </Card>

          {/* Activity feed */}
          <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
            <CardHeader className="px-6 py-4 border-b border-[#E5E7EB]">
              <h3 className="text-lg font-semibold text-[#111827]">
                Atividade Recente
              </h3>
            </CardHeader>
            <CardBody className="p-4">
              <div className="space-y-4">
                {[
                  { user: "Ana Carolina", action: "completou", target: "Objeção de Preço", time: "2min" },
                  { user: "Pedro Santos", action: "iniciou", target: "Demonstração SaaS", time: "15min" },
                  { user: "Julia Oliveira", action: "completou", target: "Primeira Abordagem", time: "32min" },
                  { user: "Marcos Lima", action: "entrou na", target: "plataforma", time: "1h" },
                  { user: "Camila Rocha", action: "completou", target: "Fechamento Final", time: "2h" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#2E63CD] mt-2" />
                    <div className="flex-1">
                      <p className="text-sm text-[#1F2937]">
                        <span className="font-medium">{activity.user}</span>{" "}
                        {activity.action}{" "}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <p className="text-xs text-[#6B7280]">{activity.time} atrás</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Top performers */}
          <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
            <CardHeader className="px-6 py-4 border-b border-[#E5E7EB]">
              <h3 className="text-lg font-semibold text-[#111827]">
                Destaques da Semana
              </h3>
            </CardHeader>
            <CardBody className="p-4">
              <div className="space-y-3">
                {mockLeaderboard.slice(0, 3).map((user, index) => (
                  <div
                    key={user.userId}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg",
                      index === 0 && "bg-[#FEF3C7]"
                    )}
                  >
                    <span className="text-lg">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </span>
                    <Avatar
                      name={user.userName}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1F2937] truncate">
                        {user.userName}
                      </p>
                    </div>
                    <span className="font-bold text-[#111827]">{user.score}</span>
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
 