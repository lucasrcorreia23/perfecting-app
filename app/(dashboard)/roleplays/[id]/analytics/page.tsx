"use client";

import { useState, useRef } from "react";
import { 
  Tabs, 
  Tab, 
  Card, 
  CardBody, 
  CardHeader, 
  Button, 
  Input,
  Chip,
  Progress
} from "@heroui/react";
import {
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  SpeakerWaveIcon,
  ChatBubbleBottomCenterTextIcon,
  ChartBarIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { AudioPlayer } from "@/components/roleplay/AudioPlayer";
import { TranscriptViewer } from "@/components/roleplay/TranscriptViewer";
import { MetricsCard } from "@/components/analytics/MetricsCard";
import { SessionHistoryChart } from "@/components/analytics/SessionHistoryChart";
import { ObjectionsViewer } from "@/components/analytics/ObjectionsViewer";
import {
  mockTranscript,
  mockFeedback,
  mockSessionAnalytics,
  mockSessionObjections,
  mockUserSessionHistory,
  mockAudioUrl,
} from "@/lib/mock-data";
import { cn, getScoreColor } from "@/lib/utils";

export default function AnalyticsPage({
  params,
}: {
  params: { id: string };
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("feedback");

  // Scroll para entrada do transcript
  const handleViewTranscript = (entryId: string) => {
    const element = document.getElementById(`transcript-${entryId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("bg-[#EBF0FA]");
      setTimeout(() => {
        element.classList.remove("bg-[#EBF0FA]");
      }, 2000);
    }
  };

  const handleExportTranscript = () => {
    // Mock: Simular exportação
    console.log("Exportando transcript...");
  };

  const roleplayTitle = "Primeira Abordagem: Decisor de TI";
  const duration = 300; // 5 minutos
  const scoreColorClass = getScoreColor(mockFeedback.overallScore);

  return (
    <div className="min-h-screen">
      {/* Hero Header com gradiente radial */}
      <div className="pt-6 px-6">
        <div className="relative overflow-hidden bg-gradient-to-b from-[#FAFAFA] to-white border border-[#E5E7EB] rounded-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(46,99,205,0.08)_0%,transparent_70%)]" />
          <div className="relative p-6 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#111827]">
                  Analytics da Sessão
                </h1>
                <p className="text-[#6B7280] mt-1">{roleplayTitle}</p>
              </div>
              <div className="text-right">
                <div className={cn("text-4xl font-bold", scoreColorClass)}>
                  {mockFeedback.overallScore}
                </div>
                <span className="text-sm text-[#6B7280]">pontos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 pb-6 px-6 pt-6">
        {/* COLUNA ESQUERDA - 2/5 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Player de áudio */}
          <AudioPlayer duration={duration} audioUrl={mockAudioUrl} />

          {/* Transcript */}
          <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
            <CardHeader className="px-6 py-4 border-b border-[#E5E7EB] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#111827]">
                  Transcrição da Conversa
                </h3>
                <Button
                  size="sm"
                  variant="bordered"
                  className="border-2 border-[#E5E7EB] hover:border-[#2E63CD] rounded-lg"
                  onPress={handleExportTranscript}
                >
                  <DocumentArrowDownIcon className="w-4 h-4" />
                  Exportar
                </Button>
              </div>
              <Input
                placeholder="Buscar na transcrição..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                startContent={<MagnifyingGlassIcon className="w-5 h-5 text-[#6B7280]" />}
                classNames={{
                  inputWrapper: [
                    "bg-white",
                    "border-2",
                    "border-[#E5E7EB]",
                    "hover:border-[#C5D4ED]",
                    "focus-within:border-[#2E63CD]",
                    "rounded-xl",
                    "shadow-sm",
                    "transition-all",
                  ],
                }}
              />
            </CardHeader>
            <CardBody className="p-6">
              <TranscriptViewer
                transcript={mockTranscript}
                searchQuery={searchQuery}
                onEntryClick={handleViewTranscript}
              />
            </CardBody>
          </Card>
        </div>

        {/* COLUNA DIREITA - 3/5 */}
        <div className="lg:col-span-3">
          <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
            <CardBody className="p-6">
              <Tabs
                selectedKey={selectedTab}
                onSelectionChange={(key) => setSelectedTab(key as string)}
                variant="underlined"
                classNames={{
                  base: "w-full",
                  tabList: "gap-6 w-full relative rounded-none p-0 border-b border-[#E5E7EB]",
                  cursor: "w-full bg-[#2E63CD] h-0.5",
                  tab: "max-w-fit px-0 h-12 font-medium",
                  tabContent: "text-[#6B7280] group-data-[selected=true]:text-[#2E63CD]",
                }}
              >
                <Tab
                  key="feedback"
                  title={
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="w-5 h-5" />
                      <span>Feedback</span>
                    </div>
                  }
                >
                  <div className="py-6 space-y-6">
                    {/* Análise Detalhada */}
                    <div>
                      <h3 className="text-lg font-semibold text-[#111827] mb-4">
                        Análise Detalhada
                      </h3>
                      <div className="space-y-4">
                        {mockFeedback.categories.map((category, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-[#1F2937]">
                                {category.name}
                              </span>
                              <span
                                className={cn(
                                  "text-sm font-semibold",
                                  getScoreColor((category.score / category.maxScore) * 100)
                                )}
                              >
                                {category.score}/{category.maxScore}
                              </span>
                            </div>
                            <Progress
                              value={(category.score / category.maxScore) * 100}
                              maxValue={100}
                              color={
                                (category.score / category.maxScore) * 100 >= 80
                                  ? "success"
                                  : (category.score / category.maxScore) * 100 >= 60
                                  ? "warning"
                                  : "danger"
                              }
                              radius="lg"
                              size="sm"
                              classNames={{
                                track: "bg-[#F3F4F6]",
                              }}
                            />
                            <p className="text-sm text-[#6B7280]">{category.feedback}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Positives */}
                      <Card className="bg-white border border-[#E5E7EB] rounded-xl gradient-success">
                        <CardHeader className="px-4 py-3 border-b border-[#E5E7EB]">
                          <div className="flex items-center gap-2">
                            <CheckCircleIcon className="w-5 h-5 text-[#10B981]" />
                            <h3 className="text-base font-semibold text-[#111827]">
                              Pontos Fortes
                            </h3>
                          </div>
                        </CardHeader>
                        <CardBody className="p-4">
                          <ul className="space-y-2">
                            {mockFeedback.highlights
                              .filter((h) => h.type === "positive")
                              .map((highlight, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-2 flex-shrink-0" />
                                  <span className="text-sm text-[#1F2937]">
                                    {highlight.content}
                                  </span>
                                </li>
                              ))}
                          </ul>
                        </CardBody>
                      </Card>

                      {/* Improvements */}
                      <Card className="bg-white border border-[#E5E7EB] rounded-xl gradient-warning">
                        <CardHeader className="px-4 py-3 border-b border-[#E5E7EB]">
                          <div className="flex items-center gap-2">
                            <ExclamationCircleIcon className="w-5 h-5 text-[#F59E0B]" />
                            <h3 className="text-base font-semibold text-[#111827]">
                              Áreas de Melhoria
                            </h3>
                          </div>
                        </CardHeader>
                        <CardBody className="p-4">
                          <ul className="space-y-2">
                            {mockFeedback.highlights
                              .filter((h) => h.type === "improvement")
                              .map((highlight, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] mt-2 flex-shrink-0" />
                                  <span className="text-sm text-[#1F2937]">
                                    {highlight.content}
                                  </span>
                                </li>
                              ))}
                          </ul>
                        </CardBody>
                      </Card>
                    </div>

                    {/* Suggestions */}
                    <Card className="bg-white border border-[#E5E7EB] rounded-xl">
                      <CardHeader className="px-4 py-3 border-b border-[#E5E7EB]">
                        <h3 className="text-base font-semibold text-[#111827]">
                          Sugestões de Melhoria
                        </h3>
                      </CardHeader>
                      <CardBody className="p-4">
                        <ul className="space-y-2">
                          {mockFeedback.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <Chip
                                size="sm"
                                variant="flat"
                                color="primary"
                                className="font-medium flex-shrink-0 mt-0.5"
                              >
                                {index + 1}
                              </Chip>
                              <span className="text-sm text-[#1F2937]">{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </CardBody>
                    </Card>
                  </div>
                </Tab>

                <Tab
                  key="analytics"
                  title={
                    <div className="flex items-center gap-2">
                      <ChartBarIcon className="w-5 h-5" />
                      <span>Analytics</span>
                    </div>
                  }
                >
                  <div className="py-6 space-y-6">
                    {/* Métricas principais em linha horizontal */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <MetricsCard
                        title="Talk/Listen Ratio"
                        value={mockSessionAnalytics.talkListenRatio.ratio}
                        unit="%"
                        threshold={{ min: 40, max: 60 }}
                        description={`Recomendado: 40 a 80`}
                      />

                      <MetricsCard
                        title="Filler Words"
                        value={mockSessionAnalytics.speechMetrics.fillerWordsCount}
                        unit="wpm"
                        threshold={{ min: 0, max: 5 }}
                        description={`Recomendado: 0.6 a 3`}
                        status={mockSessionAnalytics.speechMetrics.fillerWordsCount <= 5 ? "good" : "warning"}
                      />

                      <MetricsCard
                        title="Talk Speed"
                        value={mockSessionAnalytics.speechMetrics.wordsPerMinute}
                        unit="wpm"
                        threshold={{ min: 120, max: 160 }}
                        description="Recomendado: 110 a 160"
                      />

                      <MetricsCard
                        title="Longest Monologue"
                        value={mockSessionAnalytics.engagement.longestMonologue}
                        unit="s"
                        threshold={{ min: 20, max: 60 }}
                        description="Recomendado: 60 a 150"
                      />
                    </div>

                    {/* Gráfico de Evolução Simplificado */}
                    <div>
                      <h3 className="text-sm font-semibold text-[#6B7280] mb-4">
                        Your last 4 calls
                      </h3>
                      <div className="relative h-48 bg-white border border-[#E5E7EB] rounded-xl p-4">
                        <svg width="100%" height="100%" className="overflow-visible">
                          {/* Linhas de grade horizontais */}
                          <line x1="0" y1="0" x2="100%" y2="0" stroke="#E5E7EB" strokeWidth="1" />
                          <line x1="0" y1="33%" x2="100%" y2="33%" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4 4" />
                          <line x1="0" y1="66%" x2="100%" y2="66%" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4 4" />
                          <line x1="0" y1="100%" x2="100%" y2="100%" stroke="#E5E7EB" strokeWidth="1" />
                          
                          {/* Linha do gráfico */}
                          {mockUserSessionHistory.sessions.map((session, index) => {
                            if (index === mockUserSessionHistory.sessions.length - 1) return null;
                            const x1 = `${(index / (mockUserSessionHistory.sessions.length - 1)) * 100}%`;
                            const y1 = `${100 - session.score}%`;
                            const x2 = `${((index + 1) / (mockUserSessionHistory.sessions.length - 1)) * 100}%`;
                            const y2 = `${100 - mockUserSessionHistory.sessions[index + 1].score}%`;
                            
                            return (
                              <line
                                key={`line-${index}`}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="#3B82F6"
                                strokeWidth="2"
                              />
                            );
                          })}
                          
                          {/* Pontos e labels */}
                          {mockUserSessionHistory.sessions.map((session, index) => {
                            const x = `${(index / (mockUserSessionHistory.sessions.length - 1)) * 100}%`;
                            const y = `${100 - session.score}%`;
                            const date = session.date.toLocaleDateString("pt-BR", { month: "short", day: "numeric" });
                            const time = session.date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
                            
                            return (
                              <g key={`point-${index}`}>
                                <circle
                                  cx={x}
                                  cy={y}
                                  r="4"
                                  fill="#3B82F6"
                                  stroke="white"
                                  strokeWidth="2"
                                />
                                <text
                                  x={x}
                                  y={y}
                                  dy="-12"
                                  textAnchor="middle"
                                  className="text-xs font-semibold fill-[#111827]"
                                >
                                  {session.score}
                                </text>
                                <text
                                  x={x}
                                  y="100%"
                                  dy="16"
                                  textAnchor="middle"
                                  className="text-xs fill-[#6B7280]"
                                >
                                  {date}
                                </text>
                                <text
                                  x={x}
                                  y="100%"
                                  dy="28"
                                  textAnchor="middle"
                                  className="text-xs fill-[#6B7280]"
                                >
                                  {time}
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      </div>
                    </div>
                  </div>
                </Tab>

                <Tab
                  key="objections"
                  title={
                    <div className="flex items-center gap-2">
                      <ExclamationCircleIcon className="w-5 h-5" />
                      <span>Objeções</span>
                    </div>
                  }
                >
                  <div className="py-6">
                    <ObjectionsViewer
                      objections={mockSessionObjections}
                      onViewTranscript={handleViewTranscript}
                    />
                  </div>
                </Tab>

                <Tab
                  key="history"
                  title={
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-5 h-5" />
                      <span>Histórico</span>
                    </div>
                  }
                >
                  <div className="py-6">
                    <SessionHistoryChart sessions={mockUserSessionHistory.sessions} />
                  </div>
                </Tab>
              </Tabs>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
