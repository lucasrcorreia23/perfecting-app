"use client";

import { Card, CardBody, Chip, Accordion, AccordionItem, Button } from "@heroui/react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import type { SessionObjections } from "@/types";

interface ObjectionsViewerProps {
  objections: SessionObjections;
  onViewTranscript?: (entryId: string) => void;
}

export function ObjectionsViewer({
  objections,
  onViewTranscript,
}: ObjectionsViewerProps) {
  const getObjectionTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      price: "bg-[#F59E0B] text-white",
      timing: "bg-[#8B5CF6] text-white",
      authority: "bg-[#EF4444] text-white",
      need: "bg-[#10B981] text-white",
      competitor: "bg-[#2E63CD] text-white",
      trust: "bg-[#EC4899] text-white",
      other: "bg-[#6B7280] text-white",
    };
    return colors[type] || colors.other;
  };

  const getObjectionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      price: "Preço",
      timing: "Timing",
      authority: "Autoridade",
      need: "Necessidade",
      competitor: "Concorrente",
      trust: "Confiança",
      other: "Outro",
    };
    return labels[type] || type;
  };

  const getQualityColor = () => {
    switch (objections.handlingQuality) {
      case "excellent":
        return "success";
      case "good":
        return "success";
      case "fair":
        return "warning";
      case "poor":
        return "danger";
      default:
        return "default";
    }
  };

  const getQualityLabel = () => {
    switch (objections.handlingQuality) {
      case "excellent":
        return "Excelente";
      case "good":
        return "Bom";
      case "fair":
        return "Regular";
      case "poor":
        return "Precisa melhorar";
      default:
        return "-";
    }
  };

  const handledPercentage = objections.objectionsRaised.length > 0
    ? (objections.objectionsHandled / objections.objectionsRaised.length) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="bg-white border border-[#E5E7EB] rounded-2xl gradient-neutral">
        <CardBody className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-[#6B7280] mb-2">Objeções Identificadas</p>
              <p className="text-4xl font-bold text-[#111827]">
                {objections.objectionsRaised.length}
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-[#6B7280] mb-2">Taxa de Tratamento</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-4xl font-bold text-[#10B981]">
                  {Math.round(handledPercentage)}%
                </p>
              </div>
              <div className="flex items-center justify-center gap-4 mt-2 text-xs text-[#6B7280]">
                <span className="flex items-center gap-1">
                  <CheckCircleIcon className="w-4 h-4 text-[#10B981]" />
                  {objections.objectionsHandled} tratadas
                </span>
                <span className="flex items-center gap-1">
                  <XCircleIcon className="w-4 h-4 text-[#EF4444]" />
                  {objections.objectionsNotHandled} não tratadas
                </span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-[#6B7280] mb-2">Qualidade Geral</p>
              <Chip
                size="lg"
                color={getQualityColor()}
                variant="flat"
                className="font-semibold"
              >
                {getQualityLabel()}
              </Chip>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Objections List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-[#111827] mb-4">
          Objeções Detalhadas
        </h3>

        {objections.objectionsRaised.map((objection) => (
          <Card
            key={objection.id}
            className={cn(
              "bg-white border-l-4 transition-all duration-200 hover:shadow-md",
              objection.wasHandled
                ? "border-l-[#10B981] gradient-success"
                : "border-l-[#F59E0B] gradient-warning"
            )}
          >
            <CardBody className="p-5">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <Chip
                      size="sm"
                      className={cn(
                        "font-medium",
                        getObjectionTypeColor(objection.type)
                      )}
                    >
                      {getObjectionTypeLabel(objection.type)}
                    </Chip>

                    {objection.wasHandled ? (
                      <div className="flex items-center gap-1 text-[#10B981]">
                        <CheckCircleIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">Tratada</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[#F59E0B]">
                        <XCircleIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">Não tratada</span>
                      </div>
                    )}
                  </div>

                  {onViewTranscript && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-[#2E63CD] rounded-lg hover:bg-[#F9FAFB] transition-colors"
                      onPress={() => onViewTranscript(objection.transcriptEntryId)}
                    >
                      <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                      Ver no transcript
                    </Button>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-[#6B7280] uppercase font-medium mb-1">
                      Objeção do Cliente
                    </p>
                    <p className="text-sm text-[#1F2937] leading-relaxed bg-[#F9FAFB] p-3 rounded-lg">
                      "{objection.content}"
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#6B7280] uppercase font-medium mb-1">
                      Sua Resposta
                    </p>
                    <p className="text-sm text-[#1F2937] leading-relaxed bg-[#EBF0FA] p-3 rounded-lg">
                      "{objection.userResponse}"
                    </p>
                  </div>

                  {objection.handlingTechnique && (
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-[#6B7280]">Técnica usada:</p>
                      <Chip
                        size="sm"
                        variant="flat"
                        color="primary"
                        className="font-medium"
                      >
                        {objection.handlingTechnique}
                      </Chip>
                    </div>
                  )}
                </div>

                {/* Feedback */}
                <div className="pt-3 border-t border-[#E5E7EB]">
                  <p className="text-xs text-[#6B7280] uppercase font-medium mb-2">
                    Feedback
                  </p>
                  <p className="text-sm text-[#1F2937] leading-relaxed">
                    {objection.feedback}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Suggestions */}
      {objections.suggestions.length > 0 && (
        <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
          <CardBody className="p-6">
            <h3 className="text-lg font-semibold text-[#111827] mb-4">
              Sugestões de Melhoria
            </h3>
            <ul className="space-y-3">
              {objections.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Chip
                    size="sm"
                    variant="flat"
                    color="primary"
                    className="font-medium flex-shrink-0 mt-0.5"
                  >
                    {index + 1}
                  </Chip>
                  <span className="text-sm text-[#1F2937] leading-relaxed">
                    {suggestion}
                  </span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
