"use client";

import { Card, CardBody, Chip, Button, Divider } from "@heroui/react";
import {
  InformationCircleIcon,
  DocumentTextIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

interface ReviewStepProps {
  formData: Record<string, any>;
  onEdit: (step: number) => void;
}

export function ReviewStep({ formData, onEdit }: ReviewStepProps) {
  const getSeniorityLabel = (seniority?: string) => {
    const labels: Record<string, string> = {
      junior: "Júnior",
      mid: "Pleno",
      senior: "Sênior",
      "c-level": "C-Level",
    };
    return seniority ? labels[seniority] || seniority : "-";
  };

  const getProfileLabel = (profile?: string) => {
    const labels: Record<string, string> = {
      skeptical: "Cético",
      neutral: "Neutro",
      receptive: "Receptivo",
      enthusiastic: "Entusiasmado",
    };
    return profile ? labels[profile] || profile : "-";
  };

  const getDifficultyLabel = (difficulty?: string) => {
    const labels: Record<string, string> = {
      beginner: "Iniciante",
      intermediate: "Intermediário",
      advanced: "Avançado",
    };
    return difficulty ? labels[difficulty] || difficulty : "-";
  };

  const getInterruptionLabel = (level?: string) => {
    const labels: Record<string, string> = {
      low: "Baixo",
      medium: "Médio",
      high: "Alto",
    };
    return level ? labels[level] || level : "-";
  };

  const getAgentModeLabel = (mode?: string) => {
    const labels: Record<string, string> = {
      challenging: "Desafiador",
      balanced: "Equilibrado",
      collaborative: "Colaborativo",
    };
    return mode ? labels[mode] || mode : "-";
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#111827] mb-2">
          Revisão Final
        </h2>
        <p className="text-[#6B7280]">
          Confira todas as informações antes de salvar o roleplay
        </p>
      </div>

      {/* Step 1: Informações Gerais */}
      <Card className="bg-white border border-[#E5E7EB] rounded-2xl gradient-neutral">
        <CardBody className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EBF0FA] flex items-center justify-center">
                <InformationCircleIcon className="w-6 h-6 text-[#2E63CD]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#111827]">
                  Informações Gerais
                </h3>
                <p className="text-sm text-[#6B7280]">Etapa 1</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-[#2E63CD] rounded-lg hover:bg-[#F9FAFB] transition-colors"
              onPress={() => onEdit(1)}
            >
              <PencilIcon className="w-4 h-4" />
              Editar
            </Button>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-[#6B7280] uppercase font-medium mb-1">
                Nome
              </p>
              <p className="text-sm text-[#111827] font-medium">
                {formData.name || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] uppercase font-medium mb-1">
                Descrição
              </p>
              <p className="text-sm text-[#111827]">
                {formData.description || "-"}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-xs text-[#6B7280] uppercase font-medium mb-1">
                  Categoria
                </p>
                <Chip size="sm" variant="flat" className="font-medium capitalize">
                  {formData.category || "-"}
                </Chip>
              </div>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div>
                <p className="text-xs text-[#6B7280] uppercase font-medium mb-2">
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag: string, index: number) => (
                    <Chip key={index} size="sm" variant="flat">
                      {tag}
                    </Chip>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Step 2: Contexto */}
      <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
        <CardBody className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EBF0FA] flex items-center justify-center">
                <DocumentTextIcon className="w-6 h-6 text-[#2E63CD]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#111827]">
                  Contexto do Cenário
                </h3>
                <p className="text-sm text-[#6B7280]">Etapa 2</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-[#2E63CD] rounded-lg hover:bg-[#F9FAFB] transition-colors"
              onPress={() => onEdit(2)}
            >
              <PencilIcon className="w-4 h-4" />
              Editar
            </Button>
          </div>

          <div className="bg-[#F9FAFB] p-4 rounded-xl">
            <p className="text-sm text-[#111827] leading-relaxed">
              {formData.scenarioContext || "-"}
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Step 3: Personagem */}
      <Card className="bg-white border border-[#E5E7EB] rounded-2xl gradient-primary-soft">
        <CardBody className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EBF0FA] flex items-center justify-center">
                <UserCircleIcon className="w-6 h-6 text-[#2E63CD]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#111827]">
                  Personagem Comprador
                </h3>
                <p className="text-sm text-[#6B7280]">Etapa 3</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-[#2E63CD] rounded-lg hover:bg-[#F9FAFB] transition-colors"
              onPress={() => onEdit(3)}
            >
              <PencilIcon className="w-4 h-4" />
              Editar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#6B7280] uppercase font-medium mb-1">
                Cargo
              </p>
              <p className="text-sm text-[#111827] font-medium">
                {formData.buyerPersona?.jobTitle || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] uppercase font-medium mb-1">
                Senioridade
              </p>
              <Chip size="sm" variant="flat" color="default" className="font-medium">
                {getSeniorityLabel(formData.buyerPersona?.seniority)}
              </Chip>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] uppercase font-medium mb-1">
                Perfil
              </p>
              <Chip size="sm" variant="flat" color="primary" className="font-medium">
                {getProfileLabel(formData.buyerPersona?.profile)}
              </Chip>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] uppercase font-medium mb-1">
                Dificuldade
              </p>
              <Chip 
                size="sm" 
                variant="flat" 
                color={
                  formData.buyerPersona?.difficulty === "advanced" 
                    ? "danger" 
                    : formData.buyerPersona?.difficulty === "intermediate"
                    ? "warning"
                    : "success"
                }
                className="font-medium"
              >
                {getDifficultyLabel(formData.buyerPersona?.difficulty)}
              </Chip>
            </div>
          </div>

          {formData.buyerPersona?.mainObjections && formData.buyerPersona.mainObjections.length > 0 && (
            <>
              <Divider className="my-4" />
              <div>
                <p className="text-xs text-[#6B7280] uppercase font-medium mb-2">
                  Principais Objeções
                </p>
                <ul className="space-y-2">
                  {formData.buyerPersona.mainObjections.map((objection: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-[#111827]">
                      <span className="text-[#2E63CD] font-medium">{index + 1}.</span>
                      {objection}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {formData.buyerPersona?.personality && (
            <>
              <Divider className="my-4" />
              <div>
                <p className="text-xs text-[#6B7280] uppercase font-medium mb-2">
                  Personalidade
                </p>
                <p className="text-sm text-[#111827] bg-white p-3 rounded-lg">
                  {formData.buyerPersona.personality}
                </p>
              </div>
            </>
          )}
        </CardBody>
      </Card>

      {/* Step 4: Regras */}
      <Card className="bg-white border border-[#E5E7EB] rounded-2xl">
        <CardBody className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EBF0FA] flex items-center justify-center">
                <Cog6ToothIcon className="w-6 h-6 text-[#2E63CD]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#111827]">
                  Regras do Roleplay
                </h3>
                <p className="text-sm text-[#6B7280]">Etapa 4</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-[#2E63CD] rounded-lg hover:bg-[#F9FAFB] transition-colors"
              onPress={() => onEdit(4)}
            >
              <PencilIcon className="w-4 h-4" />
              Editar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#6B7280] uppercase font-medium mb-1">
                Encerramento Automático
              </p>
              <Chip
                size="sm"
                variant="flat"
                color={formData.rules?.canAgentEndCall ? "success" : "default"}
                className="font-medium"
              >
                {formData.rules?.canAgentEndCall ? "Ativado" : "Desativado"}
              </Chip>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] uppercase font-medium mb-1">
                Tempo Máximo
              </p>
              <p className="text-sm text-[#111827] font-medium">
                {formData.rules?.maxDuration || "-"} minutos
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] uppercase font-medium mb-1">
                Nível de Interrupção
              </p>
              <Chip size="sm" variant="flat" className="font-medium capitalize">
                {getInterruptionLabel(formData.rules?.interruptionLevel)}
              </Chip>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] uppercase font-medium mb-1">
                Modo do Agente
              </p>
              <Chip size="sm" variant="flat" color="primary" className="font-medium">
                {getAgentModeLabel(formData.rules?.agentMode)}
              </Chip>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Confirmation Message */}
      <Card className="bg-white border-2 border-[#2E63CD] rounded-2xl">
        <CardBody className="p-6 text-center">
          <p className="text-sm text-[#6B7280] leading-relaxed">
            Ao salvar, este roleplay ficará disponível para todos os usuários da plataforma.
            Você poderá editá-lo ou removê-lo posteriormente na área administrativa.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
