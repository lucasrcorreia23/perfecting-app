"use client";

import {
  Button,
  Card,
  CardBody,
  Chip,
} from "@heroui/react";
import type { OnboardingFormData } from "@/types";
import {
  BuildingOfficeIcon,
  ShoppingBagIcon,
  UserIcon,
  VideoCameraIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  PencilIcon,
  CheckCircleIcon,
  RocketLaunchIcon,
  DocumentTextIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";

interface OnboardingReviewStepProps {
  formData: OnboardingFormData;
  onEdit: (step: number) => void;
  onComplete: () => void;
  onSaveDraft: () => void;
}

export function OnboardingReviewStep({
  formData,
  onEdit,
  onComplete,
  onSaveDraft,
}: OnboardingReviewStepProps) {
  const sections = [
    {
      step: 2,
      title: "Contexto do Negócio",
      icon: BuildingOfficeIcon,
      items: [
        { label: "Empresa", value: formData.business.companyName },
        { label: "Segmento", value: formData.business.industry },
        { label: "Tamanho do Time", value: formData.business.teamSize },
        { label: "Principal Desafio", value: formData.business.mainChallenge },
      ],
    },
    {
      step: 3,
      title: "Produto/Serviço",
      icon: ShoppingBagIcon,
      items: [
        { label: "Nome", value: formData.product.name },
        { label: "Descrição", value: formData.product.shortDescription },
        { label: "Problema Resolvido", value: formData.product.problemSolved },
        { label: "Faixa de Preço", value: formData.product.priceRange },
      ],
    },
    {
      step: 4,
      title: "Persona do Comprador",
      icon: UserIcon,
      items: [
        { label: "Perfil", value: formData.buyer.profileName },
        { label: "Cargo", value: formData.buyer.jobTitle },
        { label: "Tamanhos de Empresa", value: formData.buyer.companySizes.join(", ") },
        { label: "Principais Dores", value: formData.buyer.pains },
      ],
    },
    {
      step: 5,
      title: "Conteúdo",
      icon: VideoCameraIcon,
      items: [
        { label: "Tipo", value: formData.content.type === "upload" ? "Upload" : formData.content.type === "link" ? "Link" : "Gravação" },
        { label: "URL", value: formData.content.videoUrl || "Não informado" },
      ],
    },
  ];

  const includedScenarios = formData.generatedScenarios?.filter(s => s.included) || [];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-[#111827] mb-2">
          Tudo Pronto!
        </h2>
        <p className="text-[#6B7280]">
          Revise as configurações antes de ativar o treinamento
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => {
          const Icon = section.icon;
          const hasContent = section.items.some(item => item.value);

          return (
            <Card
              key={section.step}
              className="bg-white border border-[#E5E7EB] rounded-xl hover:border-[#C5D4ED] transition-all"
            >
              <CardBody className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#EBF0FA] rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[#2E63CD]" />
                    </div>
                    <h3 className="font-medium text-[#111827]">{section.title}</h3>
                  </div>
                  <button
                    onClick={() => onEdit(section.step)}
                    className="text-[#2E63CD] hover:bg-[#EBF0FA] p-1 rounded-lg transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                </div>
                {hasContent ? (
                  <div className="space-y-1">
                    {section.items.filter(item => item.value).slice(0, 2).map((item, i) => (
                      <p key={i} className="text-sm text-[#6B7280]">
                        <span className="font-medium text-[#111827]">{item.label}:</span>{" "}
                        {item.value.length > 60 ? item.value.slice(0, 60) + "..." : item.value}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#9CA3AF] italic">Não configurado</p>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Generated Content Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Trail Summary */}
        <Card className="bg-gradient-to-br from-[#EBF0FA] to-white border border-[#C5D4ED] rounded-xl">
          <CardBody className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#2E63CD] rounded-lg flex items-center justify-center">
                  <BookOpenIcon className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-medium text-[#111827]">Trilha de Aprendizagem</h3>
              </div>
              <button
                onClick={() => onEdit(6)}
                className="text-[#2E63CD] hover:bg-white/50 p-1 rounded-lg transition-colors"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            </div>
            {formData.generatedTrail ? (
              <div>
                <p className="font-bold text-[#111827]">{formData.generatedTrail.name}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-[#6B7280]">
                  <span>{formData.generatedTrail.modules.length} módulos</span>
                  <span>•</span>
                  <span>{formData.generatedTrail.totalDuration}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#9CA3AF] italic">Aguardando geração</p>
            )}
          </CardBody>
        </Card>

        {/* Scenarios Summary */}
        <Card className="bg-gradient-to-br from-[#EBF0FA] to-white border border-[#C5D4ED] rounded-xl">
          <CardBody className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#2E63CD] rounded-lg flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-medium text-[#111827]">Cenários de Prática</h3>
              </div>
              <button
                onClick={() => onEdit(6)}
                className="text-[#2E63CD] hover:bg-white/50 p-1 rounded-lg transition-colors"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            </div>
            {includedScenarios.length > 0 ? (
              <div>
                <p className="font-bold text-[#111827]">{includedScenarios.length} cenários incluídos</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {includedScenarios.map((scenario) => (
                    <Chip
                      key={scenario.id}
                      size="sm"
                      className={
                        scenario.difficulty === "easy"
                          ? "bg-green-100 text-green-800"
                          : scenario.difficulty === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {scenario.icon} {scenario.title.slice(0, 15)}...
                    </Chip>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#9CA3AF] italic">Nenhum cenário selecionado</p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Team Summary */}
      <Card className="bg-white border border-[#E5E7EB] rounded-xl">
        <CardBody className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#EBF0FA] rounded-lg flex items-center justify-center">
                <UserGroupIcon className="w-4 h-4 text-[#2E63CD]" />
              </div>
              <h3 className="font-medium text-[#111827]">Time</h3>
            </div>
            <button
              onClick={() => onEdit(7)}
              className="text-[#2E63CD] hover:bg-[#EBF0FA] p-1 rounded-lg transition-colors"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
          </div>
          {formData.team.emails.length > 0 ? (
            <div>
              <p className="text-sm text-[#6B7280]">
                <span className="font-bold text-[#111827]">{formData.team.emails.length}</span> membros serão convidados
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.team.emails.slice(0, 3).map((email) => (
                  <Chip key={email} size="sm" variant="flat" className="bg-[#F3F4F6]">
                    {email}
                  </Chip>
                ))}
                {formData.team.emails.length > 3 && (
                  <Chip size="sm" variant="flat" className="bg-[#F3F4F6]">
                    +{formData.team.emails.length - 3} mais
                  </Chip>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#9CA3AF] italic">
              Nenhum membro adicionado (você pode adicionar depois)
            </p>
          )}
        </CardBody>
      </Card>

      {/* Next Steps */}
      <Card className="bg-[#111827] text-white rounded-xl">
        <CardBody className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <RocketLaunchIcon className="w-5 h-5" />
            Próximos Passos
          </h3>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                1
              </span>
              <span className="text-white/90">
                Os membros do time receberão convites por email
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                2
              </span>
              <span className="text-white/90">
                Eles poderão acessar a trilha de aprendizagem e os roleplays
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                3
              </span>
              <span className="text-white/90">
                Você poderá acompanhar o progresso no painel de gestão
              </span>
            </li>
          </ol>
        </CardBody>
      </Card>

      {/* Test as Student */}
      <Card className="bg-white border border-[#E5E7EB] rounded-xl">
        <CardBody className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#EBF0FA] rounded-xl flex items-center justify-center">
                <PlayIcon className="w-5 h-5 text-[#2E63CD]" />
              </div>
              <div>
                <p className="font-medium text-[#111827]">Testar como Aluno</p>
                <p className="text-sm text-[#6B7280]">
                  Veja como ficará a experiência do seu time
                </p>
              </div>
            </div>
            <Button
              variant="bordered"
              className="border-2 border-[#2E63CD] text-[#2E63CD] rounded-xl hover:bg-[#EBF0FA]"
              onPress={() => alert("Abrindo preview do aluno... (Mock)")}
            >
              Visualizar
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Final Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Button
          size="lg"
          className="bg-[#2E63CD] hover:bg-[#2451A8] text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 px-8"
          onPress={onComplete}
          startContent={<RocketLaunchIcon className="w-5 h-5" />}
        >
          Ativar Treinamento
        </Button>
        <Button
          size="lg"
          variant="bordered"
          className="border-2 border-[#E5E7EB] rounded-xl hover:border-[#2E63CD] transition-all"
          onPress={onSaveDraft}
          startContent={<DocumentTextIcon className="w-5 h-5" />}
        >
          Salvar como Rascunho
        </Button>
      </div>

      <p className="text-center text-sm text-[#6B7280]">
        <button
          onClick={() => onEdit(2)}
          className="text-[#2E63CD] hover:underline"
        >
          Voltar e Ajustar
        </button>
      </p>
    </div>
  );
}
