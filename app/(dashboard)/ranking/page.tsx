"use client";

import { Card, CardHeader, CardBody, Chip, Input, Select, SelectItem, Avatar } from "@heroui/react";
import { useState } from "react";
import {
  TrophyIcon,
  MagnifyingGlassIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { mockLeaderboard } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const timeRanges = [
  { value: "week", label: "Esta semana" },
  { value: "month", label: "Este mês" },
  { value: "quarter", label: "Este trimestre" },
  { value: "all", label: "Geral" },
];

export default function RankingPage() {
  const [timeRange, setTimeRange] = useState("month");
  const [searchQuery, setSearchQuery] = useState("");

  // Extended leaderboard with more users
  const extendedLeaderboard = [
    ...mockLeaderboard,
    {
      userId: "user-6",
      userName: "Rafael Souza",
      userAvatar: "https://i.pravatar.cc/150?u=rafael",
      rank: 6,
      score: 79,
      sessionsCompleted: 35,
      improvement: 7,
    },
    {
      userId: "user-7",
      userName: "Beatriz Costa",
      userAvatar: "https://i.pravatar.cc/150?u=beatriz",
      rank: 7,
      score: 76,
      sessionsCompleted: 32,
      improvement: 12,
    },
    {
      userId: "user-8",
      userName: "Diego Martins",
      userAvatar: "https://i.pravatar.cc/150?u=diego",
      rank: 8,
      score: 74,
      sessionsCompleted: 30,
      improvement: 4,
    },
    {
      userId: "user-9",
      userName: "Larissa Ferreira",
      userAvatar: "https://i.pravatar.cc/150?u=larissa",
      rank: 9,
      score: 72,
      sessionsCompleted: 28,
      improvement: 9,
    },
    {
      userId: "user-10",
      userName: "Thiago Almeida",
      userAvatar: "https://i.pravatar.cc/150?u=thiago",
      rank: 10,
      score: 70,
      sessionsCompleted: 25,
      improvement: 6,
    },
  ];

  const filteredLeaderboard = extendedLeaderboard.filter((entry) =>
    entry.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-br from-[#FCD34D] to-[#F59E0B] text-white";
      case 2:
        return "bg-gradient-to-br from-[#9CA3AF] to-[#6B7280] text-white";
      case 3:
        return "bg-gradient-to-br from-[#FDBA74] to-[#EA580C] text-white";
      default:
        return "bg-[#E5E7EB] text-[#6B7280]";
    }
  };

  const getRowStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-[#FEF3C7]";
      case 2:
        return "bg-[#F3F4F6]";
      case 3:
        return "bg-[#FFEDD5]";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="heading-3">Ranking</h1>
          <p className="text-[#6B7280] mt-1">
            Veja como você está em comparação com seus colegas
          </p>
        </div>

        <Select
          selectedKeys={new Set([timeRange])}
          onSelectionChange={(keys) => setTimeRange(Array.from(keys)[0] as string)}
          className="w-fit min-w-[180px] max-w-[240px] focus:outline-none"
          placeholder="Selecione o período"
          aria-label="Período"
          variant="bordered"
          radius="lg"
          classNames={{
            trigger: "bg-white border-2 border-[#E5E7EB] hover:border-[#2E63CD] data-[hover=true]:bg-[#F9FAFB] rounded-xl shadow-sm hover:shadow-md transition-all duration-200 min-h-[48px] focus:outline-none focus:ring-0 w-fit min-w-[180px] max-w-[240px]",
            value: "text-[#1F2937] font-medium",
            innerWrapper: "py-1",
            popoverContent: "py-1 rounded-xl shadow-lg border border-[#E5E7EB] bg-white outline-none ring-0 w-fit min-w-[180px] max-w-[240px]",
            listboxWrapper: "py-1",
          }}
          popoverProps={{
            classNames: {
              content: "p-1 rounded-xl shadow-lg border border-[#E5E7EB] bg-white outline-none ring-0 w-fit min-w-[180px] max-w-[240px]",
            },
          }}
        >
          {timeRanges.map((range) => (
            <SelectItem key={range.value}>{range.label}</SelectItem>
          ))}
        </Select>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Second place */}
        <Card className="bg-white border border-[#E5E7EB] rounded-2xl md:mt-8">
          <CardBody className="p-6 text-center">
            <div className="relative inline-block">
              <Avatar
                src={extendedLeaderboard[1].userAvatar}
                name={extendedLeaderboard[1].userName}
                className="w-20 h-20 mx-auto"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-[#9CA3AF] to-[#6B7280] text-white flex items-center justify-center font-bold">
                2
              </div>
            </div>
            <h3 className="font-semibold text-[#111827] mt-4">
              {extendedLeaderboard[1].userName}
            </h3>
            <p className="text-2xl font-bold text-[#6B7280] mt-2">
              {extendedLeaderboard[1].score} pts
            </p>
            <p className="text-sm text-[#6B7280]">
              {extendedLeaderboard[1].sessionsCompleted} sessões
            </p>
          </CardBody>
        </Card>

        {/* First place */}
        <Card className="bg-white border border-[#FCD34D] border-2 rounded-2xl">
          <CardBody className="p-6 text-center">
            <div className="text-4xl mb-2">👑</div>
            <div className="relative inline-block">
              <Avatar
                src={extendedLeaderboard[0].userAvatar}
                name={extendedLeaderboard[0].userName}
                className="w-24 h-24 mx-auto"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-[#FCD34D] to-[#F59E0B] text-white flex items-center justify-center font-bold text-lg">
                1
              </div>
            </div>
            <h3 className="font-bold text-[#111827] text-lg mt-4">
              {extendedLeaderboard[0].userName}
            </h3>
            <p className="text-3xl font-bold text-[#F59E0B] mt-2">
              {extendedLeaderboard[0].score} pts
            </p>
            <p className="text-sm text-[#6B7280]">
              {extendedLeaderboard[0].sessionsCompleted} sessões
            </p>
            <Chip color="success" variant="flat" className="mt-2">
              +{extendedLeaderboard[0].improvement}% melhoria
            </Chip>
          </CardBody>
        </Card>

        {/* Third place */}
        <Card className="bg-white border border-[#E5E7EB] rounded-2xl md:mt-12">
          <CardBody className="p-6 text-center">
            <div className="relative inline-block">
              <Avatar
                src={extendedLeaderboard[2].userAvatar}
                name={extendedLeaderboard[2].userName}
                className="w-20 h-20 mx-auto"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-[#FDBA74] to-[#EA580C] text-white flex items-center justify-center font-bold">
                3
              </div>
            </div>
            <h3 className="font-semibold text-[#111827] mt-4">
              {extendedLeaderboard[2].userName}
            </h3>
            <p className="text-2xl font-bold text-[#EA580C] mt-2">
              {extendedLeaderboard[2].score} pts
            </p>
            <p className="text-sm text-[#6B7280]">
              {extendedLeaderboard[2].sessionsCompleted} sessões
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Full leaderboard */}
      <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
        <CardHeader className="px-6 py-4 border-b border-[#E5E7EB]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
            <div className="flex items-center gap-2">
              <TrophyIcon className="w-5 h-5 text-[#F59E0B]" />
              <h3 className="text-lg font-semibold text-[#111827]">
                Classificação Completa
              </h3>
            </div>
            <Input
              placeholder="Buscar participante..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              classNames={{
                input: "min-w-0",
                inputWrapper: "bg-white border-2 border-[#E5E7EB] hover:border-[#D1D5DB] data-[hover=true]:bg-[#F9FAFB] data-[focus=true]:border-[#2E63CD] rounded-xl min-h-[48px]",
              }}
              startContent={<MagnifyingGlassIcon className="w-5 h-5 text-[#6B7280] shrink-0" />}
              className="max-w-xs w-full min-w-[200px]"
            />
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-[#E5E7EB]">
            {/* Header row */}
            <div className="flex items-center px-6 py-3 bg-[#F9FAFB] text-sm font-medium text-[#6B7280]">
              <div className="w-16">Posição</div>
              <div className="flex-1">Participante</div>
              <div className="w-24 text-center hidden sm:block">Sessões</div>
              <div className="w-24 text-center hidden sm:block">Melhoria</div>
              <div className="w-24 text-right">Pontuação</div>
            </div>

            {/* Data rows */}
            {filteredLeaderboard.map((entry) => (
              <div
                key={entry.userId}
                className={cn(
                  "flex items-center px-6 py-4 hover:bg-[#F5F5F5] transition-colors",
                  getRowStyle(entry.rank)
                )}
              >
                <div className="w-16">
                  <span
                    className={cn(
                      "inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm",
                      getRankStyle(entry.rank)
                    )}
                  >
                    {entry.rank}
                  </span>
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <Avatar
                    src={entry.userAvatar}
                    name={entry.userName}
                    size="sm"
                  />
                  <span className="font-medium text-[#1F2937]">
                    {entry.userName}
                  </span>
                </div>
                <div className="w-24 text-center text-sm text-[#6B7280] hidden sm:block">
                  {entry.sessionsCompleted}
                </div>
                <div className="w-24 text-center hidden sm:block">
                  <Chip
                    size="sm"
                    color="success"
                    variant="flat"
                  >
                    <ArrowTrendingUpIcon className="w-3 h-3 inline-block mr-1" />
                    +{entry.improvement}%
                  </Chip>
                </div>
                <div className="w-24 text-right">
                  <span className="font-bold text-[#111827]">{entry.score}</span>
                  <span className="text-sm text-[#6B7280] ml-1">pts</span>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
 