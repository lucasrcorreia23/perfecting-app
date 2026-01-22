"use client";

import { Card, CardHeader, CardBody, Chip, Button, Accordion, AccordionItem, Progress } from "@heroui/react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  ArrowRightIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import { cn, getScoreColor, formatDuration } from "@/lib/utils";
import type { SessionFeedback, TranscriptEntry } from "@/types";

interface FeedbackPanelProps {
  feedback: SessionFeedback;
  transcript: TranscriptEntry[];
  duration: number;
  onRetry?: () => void;
  onNext?: () => void;
  onExport?: () => void;
}

export function FeedbackPanel({
  feedback,
  transcript,
  duration,
  onRetry,
  onNext,
  onExport,
}: FeedbackPanelProps) {
  const scoreColorClass = getScoreColor(feedback.overallScore);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Overall Score Card */}
      <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
        <CardBody className="p-8 text-center">
          <p className="text-sm text-[#6B7280] uppercase tracking-wide mb-2">
            Pontuação Geral
          </p>
          <div className={cn("text-6xl font-bold mb-2", scoreColorClass)}>
            {feedback.overallScore}
          </div>
          <p className="text-lg text-[#6B7280]">de 100 pontos</p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-[#6B7280]">
            <span>Duração: {formatDuration(duration)}</span>
            <span>|</span>
            <span>{transcript.length} interações</span>
          </div>
        </CardBody>
      </Card>

      {/* Category Scores */}
      <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
        <CardHeader className="px-6 py-4 border-b border-[#E5E7EB]">
          <h3 className="text-lg font-semibold text-[#111827]">
            Análise Detalhada
          </h3>
        </CardHeader>
        <CardBody className="p-6 space-y-6">
          {feedback.categories.map((category, index) => (
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
        </CardBody>
      </Card>

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Positive highlights */}
        <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
          <CardHeader className="px-6 py-4 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-[#10B981]" />
              <h3 className="text-lg font-semibold text-[#111827]">
                Pontos Fortes
              </h3>
            </div>
          </CardHeader>
          <CardBody className="p-6">
            <ul className="space-y-3">
              {feedback.highlights
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

        {/* Improvement areas */}
        <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
          <CardHeader className="px-6 py-4 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <ExclamationCircleIcon className="w-5 h-5 text-[#F59E0B]" />
              <h3 className="text-lg font-semibold text-[#111827]">
                Áreas de Melhoria
              </h3>
            </div>
          </CardHeader>
          <CardBody className="p-6">
            <ul className="space-y-3">
              {feedback.highlights
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
      <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
        <CardHeader className="px-6 py-4 border-b border-[#E5E7EB]">
          <h3 className="text-lg font-semibold text-[#111827]">
            Sugestões de Melhoria
          </h3>
        </CardHeader>
        <CardBody className="p-6">
          <ul className="space-y-3">
            {feedback.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-3">
                <Chip
                  size="sm"
                  variant="flat"
                  color="default"
                  className="font-medium"
                >
                  {index + 1}
                </Chip>
                <span className="text-sm text-[#1F2937]">{suggestion}</span>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      {/* Transcript */}
      <Accordion variant="light" className="bg-white">
        <AccordionItem
          key="transcript"
          aria-label="Ver transcrição completa"
          
        >
          <div className="space-y-4 pb-4">
            {transcript.map((entry) => (
              <div
                key={entry.id}
                className={cn(
                  "p-4 rounded-lg",
                  entry.speaker === "user"
                    ? "bg-[#EBF0FA] ml-8"
                    : "bg-[#F5F5F5] mr-8"
                )}
              >
                <p className="text-xs text-[#6B7280] uppercase tracking-wide mb-1">
                  {entry.speaker === "user" ? "Você" : "Agente"}
                </p>
                <p className="text-sm text-[#1F2937]">{entry.content}</p>
              </div>
            ))}
          </div>
        </AccordionItem>
      </Accordion>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Button
          onPress={onExport}
          className="border-[#E5E7EB] text-[#1F2937] hover:bg-[#F5F5F5] font-medium"
        >
          <DocumentArrowDownIcon className="w-5 h-5" />
          Exportar Transcrição
        </Button>
        <Button
          onPress={onRetry}
          className="border-[#2E63CD] text-[#2E63CD] hover:bg-[#EBF0FA] font-medium"
        >
          <ArrowPathIcon className="w-5 h-5" />
          Tentar Novamente
        </Button>
        <Button

          onPress={onNext}
          className="bg-[#2E63CD] hover:bg-[#2451A8] text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
        >
          Próximo Desafio
        </Button>
      </div>
    </div>
  );
}
