"use client";

import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Textarea,
  Checkbox,
  Slider,
  Chip,
} from "@heroui/react";
import { FormInput, FormSelect, SelectItem } from "@/components/ui";
import { StepIndicator } from "@/components/roleplay/StepIndicator";
import { ReviewStep } from "@/components/roleplay/ReviewStep";
import { EditableList } from "@/components/roleplay/EditableList";
import { useRouter } from "next/navigation";
import type { RoleplayFormData } from "@/types";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

const stepLabels = [
  "Descrição",
  "Contexto",
  "Persona",
  "Objetivos",
  "Objeções",
  "Avançado",
  "Revisão",
];

export default function CreateRoleplayPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<RoleplayFormData>>({
    objectives: [],
    objections: [],
    buyerPersona: {
      jobTitle: "",
      seniority: "mid",
      profile: "neutral",
      difficulty: "intermediate",
      personality: "",
    },
    advanced: {
      canAgentEndCall: false,
      maxDuration: 15,
      interruptionLevel: "medium",
      agentMode: "balanced",
    },
  });

  const handleSave = () => {
    console.log("Salvando roleplay:", formData);
    // TODO: Integrar com API
    alert("Roleplay salvo com sucesso! (Mock)");
    router.push("/roleplays");
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name && formData.description;
      case 2:
        return formData.scenarioContext;
      case 3:
        return formData.buyerPersona?.jobTitle && formData.buyerPersona?.personality;
      case 4:
      case 5:
      case 6:
        return true; // Steps opcionais
      case 7:
        return true;
      default:
        return false;
    }
  };

  const handleSkipStep = () => {
    if (step < 7) {
      setStep(step + 1);
    }
  };

  // STEP 1: Descrição do Roleplay
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-[#111827] mb-2">
          Descrição do Roleplay
        </h2>
        <p className="text-sm text-[#6B7280]">
          Adicione uma descrição do seu roleplay abaixo. Esta é a descrição que o usuário verá ao escolher qual roleplay usar.
        </p>
      </div>

      <FormInput
        label="Nome do Roleplay"
        placeholder="Ex: Ligação de Vendas a Frio"
        value={formData.name}
        onValueChange={(value) => setFormData({ ...formData, name: value })}
        required
        description="Título claro e descritivo"
      />

      <div>
        <label className="block text-sm font-medium text-[#111827] mb-2">
          Descrição do Roleplay *
        </label>
        <Textarea
          placeholder="Você é um vendedor fazendo uma ligação fria para um potencial cliente que não estava esperando sua chamada. Tente vender seu produto de farinha persuasiva."
          value={formData.description}
          onValueChange={(value) => setFormData({ ...formData, description: value })}
          minRows={6}
          classNames={{
            inputWrapper: [
              "bg-white",
              "border-2",
              "border-[#E5E7EB]",
              "hover:border-[#C5D4ED]",
              "data-[focus=true]:border-[#2E63CD]",
              "rounded-xl",
              "shadow-sm",
              "transition-all",
              "p-3",
            ],
            input: "outline-none",
          }}
        />
        <p className="text-xs text-[#6B7280] mt-1">
          Esta descrição será mostrada ao usuário antes de iniciar o roleplay
        </p>
      </div>
    </div>
  );

  // STEP 2: Contexto do Cenário
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-[#111827] mb-2">
          Contexto
        </h2>
        <p className="text-sm text-[#6B7280]">
          Adicione informações específicas sobre o produto ou serviço que está sendo discutido durante a conversa. Não nos mostre isso aos usuários; em vez disso, use-o para informar o comportamento do usuário sobre a comunicação do usuário.
        </p>
      </div>

      <Card className="bg-[#EBF0FA] border border-[#C5D4ED] rounded-xl">
        <CardBody className="p-4">
          <p className="text-sm text-[#1F2937] leading-relaxed">
            <strong>Dica:</strong> Descreva o background do cliente, situação atual, 
            principais dores e o que motivou o contato. Seja específico mas conciso.
          </p>
        </CardBody>
      </Card>

      <div>
        <label className="block text-sm font-medium text-[#111827] mb-2">
          Contexto *
        </label>
        <Textarea
          placeholder="Você é um potencial cliente que recebeu uma ligação inesperada. Você está ocupado e inicialmente relutante em conversar. Faça perguntas sobre preço, benefícios e como o produto se diferencia da concorrência. Você precisa ser convencido de que vale a pena seu tempo e investimento. Não compre imediatamente - exija evidências concretas."
          value={formData.scenarioContext}
          onValueChange={(value) =>
            setFormData({ ...formData, scenarioContext: value })
          }
          minRows={8}
          classNames={{
            inputWrapper: [
              "bg-white",
              "border-2",
              "border-[#E5E7EB]",
              "hover:border-[#C5D4ED]",
              "data-[focus=true]:border-[#2E63CD]",
              "rounded-xl",
              "shadow-sm",
              "transition-all",
              "p-3",
            ],
            input: "outline-none",
          }}
        />
        <p className="text-xs text-[#6B7280] mt-1">
          Este contexto será usado para personalizar o comportamento do agente
        </p>
      </div>
    </div>
  );

  // STEP 3: Customização do Personagem
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-[#111827] mb-2">
          Persona
        </h2>
        <p className="text-sm text-[#6B7280]">
          Adicione as personas com as quais você pode praticar este roleplay
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Cargo"
          placeholder="Ex: Gerente de Operações em Logística Express Brasil"
          value={formData.buyerPersona?.jobTitle}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              buyerPersona: { ...formData.buyerPersona!, jobTitle: value },
            })
          }
          required
        />

        <FormSelect
          label="Nível de Senioridade"
          selectedKey={formData.buyerPersona?.seniority}
          onSelectionChange={(value) => {
            setFormData({
              ...formData,
              buyerPersona: { ...formData.buyerPersona!, seniority: value as any },
            });
          }}
          isRequired
        >
          <SelectItem key="junior">Júnior</SelectItem>
          <SelectItem key="mid">Pleno</SelectItem>
          <SelectItem key="senior">Sênior</SelectItem>
          <SelectItem key="c-level">C-Level</SelectItem>
        </FormSelect>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect
          label="Perfil Comportamental"
          selectedKey={formData.buyerPersona?.profile}
          onSelectionChange={(value) => {
            setFormData({
              ...formData,
              buyerPersona: { ...formData.buyerPersona!, profile: value as any },
            });
          }}
          isRequired
          description="Como o personagem reage inicialmente"
        >
          <SelectItem key="skeptical">Cético</SelectItem>
          <SelectItem key="neutral">Neutro</SelectItem>
          <SelectItem key="receptive">Receptivo</SelectItem>
          <SelectItem key="enthusiastic">Entusiasmado</SelectItem>
        </FormSelect>

        <FormSelect
          label="Dificuldade"
          selectedKey={formData.buyerPersona?.difficulty}
          onSelectionChange={(value) => {
            setFormData({
              ...formData,
              buyerPersona: { ...formData.buyerPersona!, difficulty: value as any },
            });
          }}
          isRequired
        >
          <SelectItem key="beginner">Iniciante</SelectItem>
          <SelectItem key="intermediate">Intermediário</SelectItem>
          <SelectItem key="advanced">Avançado</SelectItem>
        </FormSelect>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#111827] mb-2">
          Personalidade e Comportamento *
        </label>
        <Textarea
          placeholder="Ex: Analítico, ocupado, cético mas aberto a soluções inovadoras. Tende a focar em dados e ROI..."
          value={formData.buyerPersona?.personality}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              buyerPersona: { ...formData.buyerPersona!, personality: value },
            })
          }
          minRows={4}
          classNames={{
            inputWrapper: [
              "bg-white",
              "border-2",
              "border-[#E5E7EB]",
              "hover:border-[#C5D4ED]",
              "data-[focus=true]:border-[#2E63CD]",
              "rounded-xl",
              "shadow-sm",
              "transition-all",
              "p-3",
            ],
            input: "outline-none",
          }}
        />
        <p className="text-xs text-[#6B7280] mt-1">
          Descreva como o personagem se comporta durante a conversa
        </p>
      </div>
    </div>
  );

  // STEP 4: Rubrica - Objetivos (Opcional)
  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-[#111827] mb-2">
          Rubrica
        </h2>
        <p className="text-sm text-[#6B7280]">
          Adicione até 10 objetivos principais que a IA levantará como perguntas de acompanhamento caso não sejam abordados
        </p>
        <Chip size="sm" variant="flat" color="warning" className="mt-2">
          Opcional
        </Chip>
      </div>

      <Card className="bg-[#EBF0FA] border border-[#C5D4ED] rounded-xl">
        <CardBody className="p-4">
          <p className="text-sm text-[#1F2937] leading-relaxed">
            <strong>Dica:</strong> Defina objetivos claros como "Estabelecer rapport em menos de 30 segundos", 
            "Identificar pelo menos 2 dores do prospect", "Agendar próxima reunião".
          </p>
        </CardBody>
      </Card>

      <EditableList
        items={formData.objectives || []}
        onChange={(items) => setFormData({ ...formData, objectives: items })}
        placeholder="Ex: O preço pode estar acima do orçamento disponível"
        addButtonText="Adicionar"
        emptyMessage="Nenhum objetivo adicionado ainda. Adicione objetivos para guiar o roleplay."
        maxItems={10}
      />
    </div>
  );

  // STEP 5: Objeções (Opcional)
  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-[#111827] mb-2">
          Objeções
        </h2>
        <p className="text-sm text-[#6B7280]">
          Adicione até 15 objeções principais que a IA levantará como perguntas de acompanhamento caso não sejam abordadas
        </p>
        <Chip size="sm" variant="flat" color="warning" className="mt-2">
          Opcional
        </Chip>
      </div>

      <Card className="bg-[#EBF0FA] border border-[#C5D4ED] rounded-xl">
        <CardBody className="p-4">
          <p className="text-sm text-[#1F2937] leading-relaxed">
            <strong>Dica:</strong> Liste as principais objeções que o personagem levantará, como 
            "O preço pode estar acima do orçamento disponível", "Já tem fornecedores estabelecidos", 
            "Não é o momento certo para implementar".
          </p>
        </CardBody>
      </Card>

      <EditableList
        items={(formData.objections || []).map(obj => obj.content)}
        onChange={(items) => {
          const objections = items.map((content, index) => ({
            id: `obj-${Date.now()}-${index}`,
            content,
          }));
          setFormData({ ...formData, objections });
        }}
        placeholder="Ex: O preço pode estar acima do orçamento disponível"
        addButtonText="Adicionar"
        emptyMessage="Nenhuma objeção adicionada ainda. Adicione objeções que o personagem levantará."
        maxItems={15}
      />
    </div>
  );

  // STEP 6: Avançado (Opcional)
  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-[#111827] mb-2">
          Avançado
        </h2>
        <p className="text-sm text-[#6B7280]">
          Permitir que a IA encerre esta conversa
        </p>
        <Chip size="sm" variant="flat" color="warning" className="mt-2">
          Opcional
        </Chip>
      </div>

      <Card className="bg-[#EBF0FA] border border-[#C5D4ED] rounded-xl">
        <CardBody className="p-4">
          <p className="text-sm text-[#1F2937] leading-relaxed">
            Se ativado, a IA poderá encerrar a conversa quando o cenário estiver concluído. 
            Por padrão, ela usuária seu melhor julgamento para encerrar a chamada quando achar apropriado.
          </p>
        </CardBody>
      </Card>

      <Checkbox
        isSelected={formData.advanced?.canAgentEndCall}
        onValueChange={(value) =>
          setFormData({
            ...formData,
            advanced: { ...formData.advanced!, canAgentEndCall: value },
          })
        }
        radius="md"
        color="primary"
        classNames={{
          base: "py-1 focus:outline-none",
          wrapper: "mr-2 after:rounded-md border-2 border-[#E5E7EB] focus:outline-none focus:ring-0",
          label: "text-sm text-[#1F2937] font-medium",
        }}
      >
        Permitir que a IA encerre esta conversa
      </Checkbox>

      <div>
        <label className="block text-sm font-medium text-[#111827] mb-3">
          Permitir que a IA limite esta conversa para: {formData.advanced?.maxDuration || 15} min
        </label>
        <Slider
          minValue={5}
          maxValue={30}
          step={5}
          value={formData.advanced?.maxDuration || 15}
          onChange={(value) =>
            setFormData({
              ...formData,
              advanced: {
                ...formData.advanced!,
                maxDuration: Array.isArray(value) ? value[0] : value,
              },
            })
          }
          classNames={{
            track: "bg-[#E5E7EB]",
            filler: "bg-gradient-to-r from-[#2E63CD] to-[#4A7FE8]",
            thumb: "bg-[#2E63CD] border-4 border-white shadow-md",
          }}
        />
        <div className="flex justify-between text-xs text-[#6B7280] mt-1">
          <span>5 min</span>
          <span>30 min</span>
        </div>
      </div>

      <FormSelect
        label="Nível de Interrupção"
        description="Com que frequência o personagem interrompe ou questiona"
        selectedKey={formData.advanced?.interruptionLevel}
        onSelectionChange={(value) => {
          setFormData({
            ...formData,
            advanced: { ...formData.advanced!, interruptionLevel: value as any },
          });
        }}
      >
        <SelectItem key="low">Baixo - Escuta mais, interrompe pouco</SelectItem>
        <SelectItem key="medium">Médio - Equilibrado</SelectItem>
        <SelectItem key="high">Alto - Questiona e desafia frequentemente</SelectItem>
      </FormSelect>

      <FormSelect
        label="Modo do Agente"
        description="Postura geral do personagem durante a conversa"
        selectedKey={formData.advanced?.agentMode}
        onSelectionChange={(value) => {
          setFormData({
            ...formData,
            advanced: { ...formData.advanced!, agentMode: value as any },
          });
        }}
      >
        <SelectItem key="challenging">
          Desafiador - Testa o vendedor constantemente
        </SelectItem>
        <SelectItem key="balanced">
          Equilibrado - Mix de interesse e ceticismo
        </SelectItem>
        <SelectItem key="collaborative">
          Colaborativo - Mais receptivo e cooperativo
        </SelectItem>
      </FormSelect>
    </div>
  );

  const isOptionalStep = [4, 5, 6].includes(step);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFAFA] to-white">
      <div className="max-w-3xl mx-auto p-6">
        {/* Header com gradiente sutil */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(46,99,205,0.05)_0%,transparent_60%)] -z-10" />
          <h1 className="text-2xl font-bold text-[#111827]">
            Criar Novo Roleplay
          </h1>
          <p className="text-[#6B7280] mt-1">
            Configure seu roleplay personalizado em 7 etapas
          </p>
        </div>

        <StepIndicator
          currentStep={step}
          totalSteps={7}
          stepLabels={stepLabels}
        />

        <Card className="mt-6 bg-white border border-[#E5E7EB] rounded-2xl">
          <CardBody className="p-8">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            {step === 5 && renderStep5()}
            {step === 6 && renderStep6()}
            {step === 7 && (
              <ReviewStep formData={formData} onEdit={(targetStep) => setStep(targetStep)} />
            )}
          </CardBody>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {step > 1 ? (
            <Button
              variant="bordered"
              className="border-2 border-[#E5E7EB] hover:border-[#2E63CD] rounded-xl transition-all duration-200"
              onPress={() => setStep(step - 1)}
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Voltar
            </Button>
          ) : (
            <div />
          )}

          <div className="flex gap-3">
            {isOptionalStep && step < 7 && (
              <Button
                variant="ghost"
                className="rounded-xl text-[#6B7280] hover:bg-[#F9FAFB] transition-colors"
                onPress={handleSkipStep}
              >
                Pular
              </Button>
            )}
            
            {step < 7 ? (
              <Button
                className="bg-[#2E63CD] hover:bg-[#2451A8] text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                onPress={() => setStep(step + 1)}
                isDisabled={!canProceed()}
              >
                Próximo
                <ArrowRightIcon className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                className="bg-[#2E63CD] hover:bg-[#2451A8] text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                onPress={handleSave}
              >
                <CheckIcon className="w-5 h-5" />
                Salvar Roleplay
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
