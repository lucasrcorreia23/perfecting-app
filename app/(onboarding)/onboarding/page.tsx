"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Textarea,
  Checkbox,
  Chip,
  Tabs,
  Tab,
  Progress,
  Accordion,
  AccordionItem,
} from "@heroui/react";
import { FormInput, FormSelect, SelectItem } from "@/components/ui";
import { OnboardingReviewStep, OnboardingBackground } from "@/components/onboarding";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts";
import type { OnboardingFormData, GeneratedTrail, GeneratedScenario } from "@/types";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  CloudArrowUpIcon,
  LinkIcon,
  VideoCameraIcon,
  XMarkIcon,
  PlusIcon,
  SparklesIcon,
  DocumentTextIcon,
  UserGroupIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

const STORAGE_KEY = "onboarding_progress";

const stepLabels = [
  "Boas-vindas",
  "Negócio",
  "Produto",
  "Persona",
  "Conteúdo",
  "Resultado",
  "Time",
  "Conclusão",
];

const industryOptions = [
  { key: "saas", label: "SaaS / Software" },
  { key: "consulting", label: "Consultoria" },
  { key: "ecommerce", label: "E-commerce" },
  { key: "financial", label: "Serviços Financeiros" },
  { key: "healthcare", label: "Saúde" },
  { key: "education", label: "Educação" },
  { key: "manufacturing", label: "Indústria / Manufatura" },
  { key: "retail", label: "Varejo" },
  { key: "real-estate", label: "Imobiliário" },
  { key: "other", label: "Outro" },
];

const teamSizeOptions = [
  { key: "1-5", label: "1-5 pessoas" },
  { key: "6-20", label: "6-20 pessoas" },
  { key: "21-50", label: "21-50 pessoas" },
  { key: "51-200", label: "51-200 pessoas" },
  { key: "200+", label: "Mais de 200 pessoas" },
];

const priceRangeOptions = [
  { key: "low", label: "Até R$ 1.000" },
  { key: "medium", label: "R$ 1.000 - R$ 10.000" },
  { key: "high", label: "R$ 10.000 - R$ 50.000" },
  { key: "enterprise", label: "Acima de R$ 50.000" },
  { key: "variable", label: "Variável / Sob consulta" },
];

const companySizeOptions = [
  { key: "startup", label: "Startups" },
  { key: "small", label: "Pequenas empresas" },
  { key: "medium", label: "Médias empresas" },
  { key: "enterprise", label: "Grandes empresas" },
];

const awarenessOptions = [
  { key: "unaware", label: "Não conhece soluções similares" },
  { key: "problem-aware", label: "Conhece o problema, busca solução" },
  { key: "solution-aware", label: "Conhece soluções, compara opções" },
  { key: "product-aware", label: "Já conhece nosso produto" },
];

const initialFormData: OnboardingFormData = {
  business: {
    companyName: "",
    industry: "",
    teamSize: "",
    mainChallenge: "",
    trainingGoal: "",
  },
  product: {
    name: "",
    shortDescription: "",
    problemSolved: "",
    valueProposition: "",
    priceRange: "",
  },
  buyer: {
    profileName: "",
    jobTitle: "",
    companySizes: [],
    pains: "",
    objections: "",
    awarenessLevel: "",
  },
  content: {
    type: "link",
    videoUrl: "",
  },
  team: {
    emails: [],
    permissions: {
      accessTrails: true,
      accessRoleplays: true,
      createScenarios: false,
    },
    sendInvitesNow: true,
    customMessage: "",
  },
};

// Mock data for generated content (Step 6)
const mockGeneratedTrail: GeneratedTrail = {
  name: "Dominando Vendas Consultivas",
  totalDuration: "4h 30min",
  modules: [
    {
      id: "1",
      icon: "📖",
      title: "Fundamentos de Vendas",
      duration: "45min",
      topics: ["Introdução ao produto", "Proposta de valor", "Diferenciais competitivos"],
    },
    {
      id: "2",
      icon: "🎯",
      title: "Identificando Necessidades",
      duration: "1h",
      topics: ["Técnicas de descoberta", "Perguntas abertas", "Escuta ativa"],
    },
    {
      id: "3",
      icon: "💪",
      title: "Lidando com Objeções",
      duration: "1h 15min",
      topics: ["Objeções de preço", "Objeções de timing", "Objeções de autoridade"],
    },
    {
      id: "4",
      icon: "🤝",
      title: "Fechamento e Negociação",
      duration: "1h 30min",
      topics: ["Técnicas de fechamento", "Negociação de condições", "Follow-up efetivo"],
    },
  ],
};

const mockGeneratedScenarios: GeneratedScenario[] = [
  {
    id: "1",
    type: "cold-call",
    icon: "📞",
    title: "Primeira Ligação - Prospect Frio",
    difficulty: "medium",
    buyerName: "Carlos Silva",
    buyerRole: "Diretor Comercial",
    objective: "Conseguir agendar uma reunião de apresentação",
    included: true,
  },
  {
    id: "2",
    type: "demo",
    icon: "💻",
    title: "Demonstração do Produto",
    difficulty: "easy",
    buyerName: "Ana Costa",
    buyerRole: "Gerente de Operações",
    objective: "Mostrar valor e gerar interesse",
    included: true,
  },
  {
    id: "3",
    type: "objection",
    icon: "🛡️",
    title: "Lidando com Objeção de Preço",
    difficulty: "hard",
    buyerName: "Roberto Mendes",
    buyerRole: "CFO",
    objective: "Superar objeção e avançar no processo",
    included: true,
  },
  {
    id: "4",
    type: "closing",
    icon: "🤝",
    title: "Fechamento Final",
    difficulty: "hard",
    buyerName: "Mariana Santos",
    buyerRole: "CEO",
    objective: "Fechar o negócio com condições favoráveis",
    included: false,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>(initialFormData);
  const [isProcessing, setIsProcessing] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  // Load saved progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed.formData || initialFormData);
        setStep(parsed.step || 1);
      } catch {
        // Invalid data, ignore
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, formData }));
  }, [step, formData]);

  // Simulate processing for step 6 if no generated content yet
  useEffect(() => {
    if (step === 6 && !formData.generatedTrail && !isProcessing) {
      simulateProcessing();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleComplete = () => {
    localStorage.removeItem(STORAGE_KEY);
    console.log("Onboarding completo:", formData);
    alert("Treinamento ativado com sucesso! (Mock)");
    
    // Redirecionar baseado no papel do usuário
    if (isAdmin) {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  const handleSaveDraft = () => {
    console.log("Salvando rascunho:", formData);
    alert("Rascunho salvo! (Mock)");
  };

  const handleSkipOnboarding = () => {
    localStorage.removeItem(STORAGE_KEY);
    
    // Redirecionar baseado no papel do usuário
    if (isAdmin) {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return true;
      case 2:
        return formData.business.companyName && formData.business.industry;
      case 3:
        return formData.product.name && formData.product.shortDescription;
      case 4:
        return formData.buyer.jobTitle && formData.buyer.pains;
      case 5:
      case 6:
      case 7:
      case 8:
        return true;
      default:
        return false;
    }
  };

  const handleSkipStep = () => {
    if (step < 8) {
      setStep(step + 1);
    }
  };

  const simulateProcessing = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setFormData({
      ...formData,
      generatedTrail: mockGeneratedTrail,
      generatedScenarios: mockGeneratedScenarios,
    });
    setIsProcessing(false);
  };

  const handleAddEmail = () => {
    if (newEmail && newEmail.includes("@")) {
      setFormData({
        ...formData,
        team: {
          ...formData.team,
          emails: [...formData.team.emails, newEmail],
        },
      });
      setNewEmail("");
    }
  };

  const handleRemoveEmail = (email: string) => {
    setFormData({
      ...formData,
      team: {
        ...formData.team,
        emails: formData.team.emails.filter((e) => e !== email),
      },
    });
  };

  const toggleScenario = (scenarioId: string) => {
    if (!formData.generatedScenarios) return;
    setFormData({
      ...formData,
      generatedScenarios: formData.generatedScenarios.map((s) =>
        s.id === scenarioId ? { ...s, included: !s.included } : s
      ),
    });
  };

  // STEP 1: Welcome
  const renderStep1 = () => (
    <div className="text-center py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#111827] mb-3">
          Bem-vindo ao Perfecting!
        </h1>
        <p className="text-lg text-[#6B7280]">
          Vamos criar seu primeiro programa de treinamento completo
        </p>
        <p className="text-sm text-[#6B7280] mt-4">
          Tempo estimado: 9 minutos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Card APRENDA */}
        <Card className="border-2 border-[#E5E7EB] rounded-2xl overflow-hidden">
          <CardBody className="p-0 relative h-64">
            {/* Background image - pessoa estudando/aprendendo */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80')`
              }}
            />
            
            {/* Overlay escuro para melhor leitura */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
            
            {/* Ícone grande no topo */}
            <div className="absolute top-6 left-6 z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <BookOpenIcon className="w-10 h-10 text-white" />
              </div>
            </div>
            
            {/* Conteúdo na parte inferior */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
              <h3 className="text-2xl font-bold mb-2">
                APRENDA
              </h3>
              <p className="text-sm text-white/90 leading-relaxed">
                Trilhas de aprendizagem personalizadas com vídeos, quizzes e materiais de apoio
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Card PRATIQUE */}
        <Card className="border-2 border-[#E5E7EB] rounded-2xl overflow-hidden">
          <CardBody className="p-0 relative h-64">
            {/* Background image - pessoas conversando/praticando */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&auto=format&fit=crop&q=80')`
              }}
            />
            
            {/* Overlay escuro para melhor leitura */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
            
            {/* Ícone grande no topo */}
            <div className="absolute top-6 left-6 z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="w-10 h-10 text-white" />
              </div>
            </div>
            
            {/* Conteúdo na parte inferior */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
              <h3 className="text-2xl font-bold mb-2">
                PRATIQUE
              </h3>
              <p className="text-sm text-white/90 leading-relaxed">
                Cenários de roleplay com IA para praticar conversas de vendas em ambiente seguro
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="mb-6">
        <Button
          size="lg"
          className="bg-[#2E63CD] hover:bg-[#2451A8] text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 px-8"
          onPress={() => setStep(2)}
        >
          Começar Agora
          <ArrowRightIcon className="w-5 h-5 ml-2" />
        </Button>
      </div>

      <button
        onClick={handleSkipOnboarding}
        className="text-sm text-[#6B7280] hover:text-[#2E63CD] underline transition-colors"
      >
        Pular e explorar sozinho
      </button>
    </div>
  );

  // STEP 2: Business Context
  const renderStep2 = () => (
    <div>
      <div className="mb-6">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-xl font-bold text-[#111827]">
            Contexto do Negócio
          </h2>
          <div className="flex items-center gap-2">
            {stepLabels.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all ${
                  index < step ? 'w-6 bg-[#2E63CD]' : 'w-6 bg-[#E5E7EB]'
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-sm text-[#6B7280]">
          Conte-nos sobre sua empresa para personalizarmos o treinamento
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Nome da Empresa"
          placeholder="Ex: Acme Tecnologia"
          value={formData.business.companyName}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              business: { ...formData.business, companyName: value },
            })
          }
          isRequired
        />

        <FormSelect
          label="Segmento/Indústria"
          placeholder="Selecione o segmento"
          selectedKey={formData.business.industry}
          onSelectionChange={(value) =>
            setFormData({
              ...formData,
              business: { ...formData.business, industry: value },
            })
          }
          isRequired
        >
          {industryOptions.map((opt) => (
            <SelectItem key={opt.key}>{opt.label}</SelectItem>
          ))}
        </FormSelect>

        <FormSelect
          label="Tamanho do Time de Vendas"
          placeholder="Selecione o tamanho"
          selectedKey={formData.business.teamSize}
          onSelectionChange={(value) =>
            setFormData({
              ...formData,
              business: { ...formData.business, teamSize: value },
            })
          }
        >
          {teamSizeOptions.map((opt) => (
            <SelectItem key={opt.key}>{opt.label}</SelectItem>
          ))}
        </FormSelect>

        <div>
          <label className="block text-sm font-medium text-[#111827] mb-2">
            Principal Desafio do Time
          </label>
          <Textarea
            placeholder="Ex: Dificuldade em lidar com objeções de preço..."
            value={formData.business.mainChallenge}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                business: { ...formData.business, mainChallenge: value },
              })
            }
            minRows={3}
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
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-[#111827] mb-2">
            Objetivo do Treinamento
          </label>
          <Textarea
            placeholder="Ex: Aumentar taxa de fechamento em 20%, melhorar qualificação de leads..."
            value={formData.business.trainingGoal}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                business: { ...formData.business, trainingGoal: value },
              })
            }
            minRows={3}
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
        </div>

        <div className="col-span-2">
          <Card className="bg-[#EBF0FA] border border-[#C5D4ED] rounded-xl">
            <CardBody className="p-4">
              <p className="text-sm text-[#1F2937] leading-relaxed">
                <strong>💡 Dica:</strong> Quanto mais específico você for sobre seus desafios, mais personalizado será o treinamento gerado pela IA.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );

  // STEP 3: Product Setup
  const renderStep3 = () => (
    <div>
      <div className="mb-6">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-xl font-bold text-[#111827]">
            O Que Você Vende
          </h2>
          <div className="flex items-center gap-2">
            {stepLabels.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all ${
                  index < step ? 'w-6 bg-[#2E63CD]' : 'w-6 bg-[#E5E7EB]'
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-sm text-[#6B7280]">
          Descreva seu produto ou serviço principal
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Nome do Produto/Serviço"
          placeholder="Ex: CRM Pro, Consultoria de Vendas"
          value={formData.product.name}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              product: { ...formData.product, name: value },
            })
          }
          isRequired
        />

        <FormSelect
          label="Faixa de Preço"
          placeholder="Selecione a faixa"
          selectedKey={formData.product.priceRange}
          onSelectionChange={(value) =>
            setFormData({
              ...formData,
              product: { ...formData.product, priceRange: value },
            })
          }
        >
          {priceRangeOptions.map((opt) => (
            <SelectItem key={opt.key}>{opt.label}</SelectItem>
          ))}
        </FormSelect>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-[#111827] mb-2">
            Descrição em 1 Frase <span className="text-red-500">*</span>
          </label>
          <FormInput
            placeholder="Ex: Sistema de gestão que aumenta produtividade em 40%"
            value={formData.product.shortDescription}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                product: { ...formData.product, shortDescription: value.slice(0, 100) },
              })
            }
            endContent={
              <span className="text-xs text-[#6B7280]">
                {formData.product.shortDescription.length}/100
              </span>
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#111827] mb-2">
            Qual Problema Resolve
          </label>
          <Textarea
            placeholder="Ex: Equipes de vendas perdem tempo com tarefas manuais..."
            value={formData.product.problemSolved}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                product: { ...formData.product, problemSolved: value },
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
        </div>

        <div>
          <label className="block text-sm font-medium text-[#111827] mb-2">
            Proposta de Valor Principal
          </label>
          <Textarea
            placeholder="Ex: Automatizamos 80% das tarefas repetitivas..."
            value={formData.product.valueProposition}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                product: { ...formData.product, valueProposition: value },
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
        </div>

        <div className="col-span-2">
          <Button
            variant="bordered"
            className="border-2 border-[#2E63CD] text-[#2E63CD] rounded-xl hover:bg-[#EBF0FA] transition-all w-full"
            startContent={<SparklesIcon className="w-4 h-4" />}
            onPress={() => alert("Funcionalidade de IA em desenvolvimento (Mock)")}
          >
            Gerar com IA
          </Button>
        </div>
      </div>
    </div>
  );

  // STEP 4: Buyer Persona
  const renderStep4 = () => (
    <div>
      <div className="mb-6">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-xl font-bold text-[#111827]">
            Para Quem Você Vende
          </h2>
          <div className="flex items-center gap-2">
            {stepLabels.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all ${
                  index < step ? 'w-6 bg-[#2E63CD]' : 'w-6 bg-[#E5E7EB]'
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-sm text-[#6B7280]">
          Descreva o perfil do seu comprador ideal (ICP)
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Nome do Perfil"
          placeholder="Ex: Decisor Corporativo"
          value={formData.buyer.profileName}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              buyer: { ...formData.buyer, profileName: value },
            })
          }
        />

        <FormInput
          label="Cargo/Função Típica"
          placeholder="Ex: Diretor de Vendas, CEO"
          value={formData.buyer.jobTitle}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              buyer: { ...formData.buyer, jobTitle: value },
            })
          }
          isRequired
        />

        <div>
          <label className="block text-sm font-medium text-[#111827] mb-3">
            Tamanho da Empresa Alvo
          </label>
          <div className="space-y-2">
            {companySizeOptions.map((opt) => (
              <Checkbox
                key={opt.key}
                isSelected={formData.buyer.companySizes.includes(opt.key)}
                onValueChange={(checked) => {
                  const sizes = checked
                    ? [...formData.buyer.companySizes, opt.key]
                    : formData.buyer.companySizes.filter((s) => s !== opt.key);
                  setFormData({
                    ...formData,
                    buyer: { ...formData.buyer, companySizes: sizes },
                  });
                }}
                radius="md"
                color="primary"
                classNames={{
                  base: "py-1 focus:outline-none",
                  wrapper: "mr-2 after:rounded-md border-2 border-[#E5E7EB]",
                  label: "text-sm text-[#1F2937] font-medium",
                }}
              >
                {opt.label}
              </Checkbox>
            ))}
          </div>
        </div>

        <FormSelect
          label="Nível de Conhecimento sobre Soluções"
          placeholder="Selecione"
          selectedKey={formData.buyer.awarenessLevel}
          onSelectionChange={(value) =>
            setFormData({
              ...formData,
              buyer: { ...formData.buyer, awarenessLevel: value },
            })
          }
        >
          {awarenessOptions.map((opt) => (
            <SelectItem key={opt.key}>{opt.label}</SelectItem>
          ))}
        </FormSelect>

        <div>
          <label className="block text-sm font-medium text-[#111827] mb-2">
            Principais Dores <span className="text-red-500">*</span>
          </label>
          <Textarea
            placeholder="Ex: Falta de visibilidade no pipeline..."
            value={formData.buyer.pains}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                buyer: { ...formData.buyer, pains: value },
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
        </div>

        <div>
          <label className="block text-sm font-medium text-[#111827] mb-2">
            Objeções Comuns
          </label>
          <Textarea
            placeholder="Ex: Preço alto, já tem ferramenta..."
            value={formData.buyer.objections}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                buyer: { ...formData.buyer, objections: value },
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
        </div>

        <div className="col-span-2">
          {/* Preview Card */}
          <Card className="bg-gradient-to-br from-[#EBF0FA] to-white border border-[#C5D4ED] rounded-xl">
            <CardBody className="p-4">
              <p className="text-xs text-[#6B7280] mb-2">Preview do Agente</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2E63CD] rounded-full flex items-center justify-center text-white font-bold">
                  {formData.buyer.profileName?.[0] || "?"}
                </div>
                <div>
                  <p className="font-medium text-[#111827]">
                    {formData.buyer.profileName || "Nome do Perfil"}
                  </p>
                  <p className="text-sm text-[#6B7280]">
                    {formData.buyer.jobTitle || "Cargo"}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );

  // STEP 5: Content Upload
  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-xl font-bold text-[#111827]">
            Conteúdo de Treinamento
          </h2>
          <div className="flex items-center gap-2">
            {stepLabels.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all ${
                  index < step ? 'w-6 bg-[#2E63CD]' : 'w-6 bg-[#E5E7EB]'
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-sm text-[#6B7280]">
          Adicione vídeos ou materiais para criar a trilha de aprendizagem
        </p>
      </div>

      <Tabs
        selectedKey={formData.content.type}
        onSelectionChange={(key) =>
          setFormData({
            ...formData,
            content: { ...formData.content, type: key as "upload" | "link" | "record" },
          })
        }
        classNames={{
          tabList: "bg-[#F3F4F6] p-1 rounded-xl",
          tab: "data-[selected=true]:bg-white data-[selected=true]:shadow-sm rounded-lg",
          cursor: "bg-white rounded-lg",
        }}
      >
        <Tab
          key="upload"
          title={
            <div className="flex items-center gap-2">
              <CloudArrowUpIcon className="w-4 h-4" />
              Upload
            </div>
          }
        >
          <div className="mt-6">
            <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-8 text-center hover:border-[#2E63CD] transition-colors cursor-pointer">
              <CloudArrowUpIcon className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4" />
              <p className="text-[#111827] font-medium mb-2">
                Arraste um arquivo ou clique para selecionar
              </p>
              <p className="text-sm text-[#6B7280]">
                MP4, MOV, AVI até 500MB
              </p>
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData({
                      ...formData,
                      content: { ...formData.content, uploadedFile: file },
                    });
                  }
                }}
              />
            </div>
            {formData.content.uploadedFile && (
              <div className="mt-4 flex items-center gap-2 text-sm text-[#111827]">
                <DocumentTextIcon className="w-4 h-4" />
                {formData.content.uploadedFile.name}
              </div>
            )}
          </div>
        </Tab>

        <Tab
          key="link"
          title={
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              Link
            </div>
          }
        >
          <div className="mt-6 space-y-4">
            <FormInput
              label="URL do Vídeo"
              placeholder="https://youtube.com/watch?v=... ou https://vimeo.com/..."
              value={formData.content.videoUrl}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  content: { ...formData.content, videoUrl: value },
                })
              }
              startContent={<LinkIcon className="w-4 h-4 text-[#9CA3AF]" />}
            />
            <Button
              variant="bordered"
              className="border-2 border-[#E5E7EB] rounded-xl"
              onPress={() => alert("Verificando URL... (Mock)")}
            >
              Verificar URL
            </Button>
          </div>
        </Tab>

        <Tab
          key="record"
          title={
            <div className="flex items-center gap-2">
              <VideoCameraIcon className="w-4 h-4" />
              Gravar
            </div>
          }
        >
          <div className="mt-6 text-center">
            <div className="w-24 h-24 bg-[#EBF0FA] rounded-full flex items-center justify-center mx-auto mb-4">
              <VideoCameraIcon className="w-12 h-12 text-[#2E63CD]" />
            </div>
            <p className="text-[#111827] font-medium mb-2">
              Grave diretamente do navegador
            </p>
            <p className="text-sm text-[#6B7280] mb-4">
              Use sua webcam para gravar um vídeo de treinamento
            </p>
            <Button
              className="bg-[#2E63CD] hover:bg-[#2451A8] text-white font-medium rounded-xl"
              onPress={() => alert("Funcionalidade de gravação em desenvolvimento (Mock)")}
            >
              Iniciar Gravação
            </Button>
          </div>
        </Tab>
      </Tabs>

      <Card className="bg-[#EBF0FA] border border-[#C5D4ED] rounded-xl">
        <CardBody className="p-4">
          <p className="text-sm text-[#1F2937] leading-relaxed">
            <strong>💡 Sugestões de conteúdo:</strong>
          </p>
          <ul className="text-sm text-[#6B7280] mt-2 space-y-1 list-disc list-inside">
            <li>Apresentação do produto/serviço</li>
            <li>Pitch de vendas ideal</li>
            <li>Como lidar com objeções comuns</li>
            <li>Casos de sucesso de clientes</li>
          </ul>
        </CardBody>
      </Card>

      {isProcessing && (
        <Card className="bg-white border border-[#E5E7EB] rounded-xl">
          <CardBody className="p-6 text-center">
            <Progress
              isIndeterminate
              className="mb-4"
              classNames={{
                indicator: "bg-gradient-to-r from-[#2E63CD] to-[#4A7FE8]",
              }}
            />
            <p className="text-[#111827] font-medium">Processando conteúdo com IA...</p>
            <p className="text-sm text-[#6B7280]">Isso pode levar alguns segundos</p>
          </CardBody>
        </Card>
      )}
    </div>
  );

  // STEP 6: Review Results
  const renderStep6 = () => {
    if (isProcessing) {
      return (
        <div className="text-center py-12">
          <Progress
            isIndeterminate
            className="max-w-md mx-auto mb-6"
            classNames={{
              indicator: "bg-gradient-to-r from-[#2E63CD] to-[#4A7FE8]",
            }}
          />
          <p className="text-lg font-medium text-[#111827]">
            Gerando seu programa de treinamento...
          </p>
          <p className="text-sm text-[#6B7280] mt-2">
            A IA está criando trilhas e cenários personalizados
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="mb-6">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-xl font-bold text-[#111827]">
              Resultado Gerado pela IA
            </h2>
            <div className="flex items-center gap-2">
              {stepLabels.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all ${
                    index < step ? 'w-6 bg-[#2E63CD]' : 'w-6 bg-[#E5E7EB]'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-[#6B7280]">
            Revise e ajuste o conteúdo gerado antes de prosseguir
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Learning Trail */}
          <div>
            <h3 className="font-medium text-[#111827] mb-3 flex items-center gap-2">
              <BookOpenIcon className="w-5 h-5 text-[#2E63CD]" />
              Trilha de Aprendizagem
            </h3>
            {formData.generatedTrail && (
              <Card className="bg-white border border-[#E5E7EB] rounded-xl">
                <CardBody className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-[#111827]">
                      {formData.generatedTrail.name}
                    </h4>
                    <Chip size="sm" className="bg-[#EBF0FA] text-[#2E63CD]">
                      {formData.generatedTrail.totalDuration}
                    </Chip>
                  </div>
                  <Accordion variant="light">
                    {formData.generatedTrail.modules.map((module) => (
                      <AccordionItem
                        key={module.id}
                        aria-label={module.title}
                        title={
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{module.icon}</span>
                            <span className="font-medium">{module.title}</span>
                            <Chip size="sm" variant="flat" className="ml-auto">
                              {module.duration}
                            </Chip>
                          </div>
                        }
                      >
                        <ul className="text-sm text-[#6B7280] space-y-1 pl-8">
                          {module.topics.map((topic, i) => (
                            <li key={i}>• {topic}</li>
                          ))}
                        </ul>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardBody>
              </Card>
            )}
          </div>

          {/* Right Column: Roleplay Scenarios */}
          <div>
            <h3 className="font-medium text-[#111827] mb-3 flex items-center gap-2">
              <ChatBubbleLeftRightIcon className="w-5 h-5 text-[#2E63CD]" />
              Cenários de Prática
            </h3>
            <div className="space-y-3">
              {formData.generatedScenarios?.map((scenario) => (
                <Card
                  key={scenario.id}
                  className={`border rounded-xl transition-all cursor-pointer ${
                    scenario.included
                      ? "bg-white border-[#2E63CD]"
                      : "bg-[#F9FAFB] border-[#E5E7EB] opacity-60"
                  }`}
                  isPressable
                  onPress={() => toggleScenario(scenario.id)}
                >
                  <CardBody className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        isSelected={scenario.included}
                        onValueChange={() => toggleScenario(scenario.id)}
                        radius="md"
                        color="primary"
                        classNames={{
                          wrapper: "after:rounded-md border-2 border-[#E5E7EB]",
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{scenario.icon}</span>
                          <span className="font-medium text-[#111827]">
                            {scenario.title}
                          </span>
                          <Chip
                            size="sm"
                            className={
                              scenario.difficulty === "easy"
                                ? "bg-green-100 text-green-800"
                                : scenario.difficulty === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {scenario.difficulty === "easy"
                              ? "Fácil"
                              : scenario.difficulty === "medium"
                              ? "Médio"
                              : "Difícil"}
                          </Chip>
                        </div>
                        <p className="text-sm text-[#6B7280]">
                          {scenario.buyerName} • {scenario.buyerRole}
                        </p>
                        <p className="text-xs text-[#9CA3AF] mt-1">
                          Objetivo: {scenario.objective}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="bordered"
                size="sm"
                className="border-2 border-[#E5E7EB] rounded-xl"
                startContent={<SparklesIcon className="w-4 h-4" />}
                onPress={() => alert("Gerando mais cenários... (Mock)")}
              >
                Gerar Mais
              </Button>
              <Button
                variant="bordered"
                size="sm"
                className="border-2 border-[#E5E7EB] rounded-xl"
                startContent={<PlusIcon className="w-4 h-4" />}
                onPress={() => alert("Adicionar cenário manual (Mock)")}
              >
                Adicionar Manual
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // STEP 7: Team Invite
  const renderStep7 = () => (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-xl font-bold text-[#111827]">
            Adicionar Time
          </h2>
          <div className="flex items-center gap-2">
            {stepLabels.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all ${
                  index < step ? 'w-6 bg-[#2E63CD]' : 'w-6 bg-[#E5E7EB]'
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-sm text-[#6B7280]">
          Convide membros do seu time para acessar o treinamento
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Email Input */}
          <div className="flex gap-2">
            <FormInput
              label="Email do Membro"
              placeholder="email@empresa.com"
              value={newEmail}
              onValueChange={setNewEmail}
              startContent={<EnvelopeIcon className="w-4 h-4 text-[#9CA3AF]" />}
            />
            <Button
              className="bg-[#2E63CD] hover:bg-[#2451A8] text-white font-medium rounded-xl mt-8"
              onPress={handleAddEmail}
              isDisabled={!newEmail.includes("@")}
            >
              <PlusIcon className="w-5 h-5" />
            </Button>
          </div>

          {/* Email List */}
          {formData.team.emails.length > 0 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#111827]">
                Membros Adicionados ({formData.team.emails.length})
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {formData.team.emails.map((email) => (
                  <div
                    key={email}
                    className="flex items-center justify-between bg-[#F9FAFB] rounded-lg px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#2E63CD] rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {email[0].toUpperCase()}
                      </div>
                      <span className="text-sm text-[#111827]">{email}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveEmail(email)}
                      className="text-[#9CA3AF] hover:text-red-500 transition-colors"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            variant="bordered"
            className="border-2 border-[#E5E7EB] rounded-xl w-full"
            onPress={() => alert("Importar CSV (Mock)")}
          >
            Importar de CSV
          </Button>

          {/* Permissions */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-3">
              Permissões
            </label>
            <div className="space-y-2">
              <Checkbox
                isSelected={formData.team.permissions.accessTrails}
                onValueChange={(checked) =>
                  setFormData({
                    ...formData,
                    team: {
                      ...formData.team,
                      permissions: { ...formData.team.permissions, accessTrails: checked },
                    },
                  })
                }
                radius="md"
                color="primary"
                classNames={{
                  base: "py-1",
                  wrapper: "mr-2 after:rounded-md border-2 border-[#E5E7EB]",
                  label: "text-sm text-[#1F2937]",
                }}
              >
                Acessar trilhas de aprendizagem
              </Checkbox>
              <Checkbox
                isSelected={formData.team.permissions.accessRoleplays}
                onValueChange={(checked) =>
                  setFormData({
                    ...formData,
                    team: {
                      ...formData.team,
                      permissions: { ...formData.team.permissions, accessRoleplays: checked },
                    },
                  })
                }
                radius="md"
                color="primary"
                classNames={{
                  base: "py-1",
                  wrapper: "mr-2 after:rounded-md border-2 border-[#E5E7EB]",
                  label: "text-sm text-[#1F2937]",
                }}
              >
                Acessar roleplays de prática
              </Checkbox>
              <Checkbox
                isSelected={formData.team.permissions.createScenarios}
                onValueChange={(checked) =>
                  setFormData({
                    ...formData,
                    team: {
                      ...formData.team,
                      permissions: { ...formData.team.permissions, createScenarios: checked },
                    },
                  })
                }
                radius="md"
                color="primary"
                classNames={{
                  base: "py-1",
                  wrapper: "mr-2 after:rounded-md border-2 border-[#E5E7EB]",
                  label: "text-sm text-[#1F2937]",
                }}
              >
                Criar cenários personalizados
              </Checkbox>
            </div>
          </div>

          {/* Send Options */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-3">
              Quando Enviar Convites
            </label>
            <div className="space-y-2">
              <Checkbox
                isSelected={formData.team.sendInvitesNow}
                onValueChange={(checked) =>
                  setFormData({
                    ...formData,
                    team: { ...formData.team, sendInvitesNow: checked },
                  })
                }
                radius="md"
                color="primary"
                classNames={{
                  base: "py-1",
                  wrapper: "mr-2 after:rounded-md border-2 border-[#E5E7EB]",
                  label: "text-sm text-[#1F2937]",
                }}
              >
                Enviar convites agora
              </Checkbox>
            </div>
          </div>

          {/* Custom Message */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-2">
              Mensagem Personalizada (opcional)
            </label>
            <Textarea
              placeholder="Adicione uma mensagem para os convites..."
              value={formData.team.customMessage}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  team: { ...formData.team, customMessage: value },
                })
              }
              minRows={3}
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
          </div>
        </div>

        {/* Metrics Preview */}
        <div>
          <Card className="bg-gradient-to-br from-[#EBF0FA] to-white border border-[#C5D4ED] rounded-xl">
            <CardBody className="p-6">
              <h3 className="font-medium text-[#111827] mb-4 flex items-center gap-2">
                <UserGroupIcon className="w-5 h-5 text-[#2E63CD]" />
                Estimativa do Treinamento
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6B7280]">Membros do time</span>
                  <span className="font-bold text-[#111827]">
                    {formData.team.emails.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6B7280]">Trilhas disponíveis</span>
                  <span className="font-bold text-[#111827]">1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6B7280]">Cenários de prática</span>
                  <span className="font-bold text-[#111827]">
                    {formData.generatedScenarios?.filter((s) => s.included).length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6B7280]">Duração total</span>
                  <span className="font-bold text-[#111827]">
                    {formData.generatedTrail?.totalDuration || "~4h"}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-[#EBF0FA] border border-[#C5D4ED] rounded-xl mt-4">
            <CardBody className="p-4">
              <p className="text-sm text-[#1F2937] leading-relaxed">
                <strong>💡 Dica:</strong> Você pode adicionar mais membros depois. Cada membro receberá um email com instruções de acesso.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );

  // STEP 8: Completion
  const renderStep8 = () => (
    <OnboardingReviewStep
      formData={formData}
      onEdit={(targetStep) => setStep(targetStep)}
      onComplete={handleComplete}
      onSaveDraft={handleSaveDraft}
    />
  );

  const isOptionalStep = [5, 7].includes(step);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background mockup with blur */}
      <OnboardingBackground />

      {/* Modal content in foreground */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Modal card */}
          <Card className="bg-white border-2 border-[#E5E7EB] rounded-2xl shadow-xs">
            <CardBody className="p-12">

              {/* Content */}
              <div className="min-h-[400px]">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
                {step === 5 && renderStep5()}
                {step === 6 && renderStep6()}
                {step === 7 && renderStep7()}
                {step === 8 && renderStep8()}
              </div>

              {/* Navigation Buttons */}
              {step > 1 && (
                <div className="flex justify-between mt-8 pt-6 border-t border-[#E5E7EB]">
                  <Button
                    variant="bordered"
                    className="border-2 border-[#E5E7EB] hover:border-[#2E63CD] rounded-xl transition-all duration-200"
                    onPress={() => setStep(step - 1)}
                  >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Voltar
                  </Button>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, formData }));
                        alert("Progresso salvo! Você pode continuar depois.");
                      }}
                      className="text-sm text-[#6B7280] hover:text-[#2E63CD] transition-colors px-4"
                    >
                      Salvar e Continuar Depois
                    </button>

                    {isOptionalStep && step < 8 && (
                      <Button
                        variant="ghost"
                        className="rounded-xl text-[#6B7280] hover:bg-[#F9FAFB] transition-colors"
                        onPress={handleSkipStep}
                      >
                        Pular
                      </Button>
                    )}

                    {step < 8 ? (
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
                        onPress={handleComplete}
                      >
                        <CheckIcon className="w-5 h-5" />
                        Ativar Treinamento
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
