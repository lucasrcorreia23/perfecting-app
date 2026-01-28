"use client";

import { Card, CardHeader, CardBody, Chip, Avatar } from "@heroui/react";
import {
  PlayCircleIcon,
  TrophyIcon,
  ClockIcon,
  FireIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

export function OnboardingBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Blurred overlay */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-xs z-10" />
      
      {/* Mock dashboard content */}
      <div className="relative h-full overflow-hidden opacity-60">
        <div className="p-8 space-y-8">
          {/* Welcome section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#111827]">Bem-vindo de volta!</h1>
              <p className="text-[#6B7280] my-2">
                Continue seu treinamento e melhore suas habilidades de vendas.
              </p>
            </div>
            <div className="inline-flex items-center justify-center px-4 py-2 text-lg bg-[#2E63CD] text-white font-medium rounded-xl min-h-[48px] min-w-[160px]">
              Iniciar Prática
            </div>
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
                    <p className="text-2xl font-semibold text-[#111827]">24</p>
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
                    <p className="text-2xl font-semibold text-[#10B981]">78</p>
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
                    <p className="text-2xl font-semibold text-[#111827]">12h</p>
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
                    <p className="text-2xl font-semibold text-[#111827]">7 dias</p>
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
                <h2 className="text-2xl font-bold text-[#111827]">Role-plays Sugeridos</h2>
                <span className="text-sm text-[#2E63CD] font-medium">Ver todos</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="bg-white border border-[#E5E7EB] rounded-2xl">
                    <CardBody className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar size="md" className="bg-[#2E63CD]" />
                        <div>
                          <p className="font-semibold text-[#111827]">Roleplay {i}</p>
                          <p className="text-sm text-[#6B7280]">Agente Virtual</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Chip size="sm" className="bg-[#EBF0FA] text-[#2E63CD]">
                          Intermediário
                        </Chip>
                      </div>
                    </CardBody>
                  </Card>
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
                    {["Semana 1", "Semana 2", "Semana 3"].map((week) => (
                      <div key={week} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#6B7280]">{week}</span>
                          <span className="font-medium text-[#1F2937]">5 sessões • 75 pts</span>
                        </div>
                        <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                          <div className="h-full bg-[#10B981]" style={{ width: "75%" }} />
                        </div>
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
                    <span className="text-sm text-[#2E63CD]">Ver mais</span>
                  </div>
                </CardHeader>
                <CardBody className="p-4">
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((rank) => (
                      <div key={rank} className="flex items-center gap-3 p-3 rounded-lg bg-[#F3F4F6]">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-[#E5E7EB] text-[#6B7280]">
                          {rank}
                        </span>
                        <Avatar size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#1F2937]">Usuário {rank}</p>
                          <p className="text-xs text-[#6B7280]">{10 - rank} sessões</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-[#111827]">{90 - rank * 5}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
