"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Card, CardBody, Chip, Progress, Avatar, Ripple } from "@heroui/react";
import {
  PhoneIcon,
  XMarkIcon,
  UserIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import {
  MicrophoneIcon,
  PauseIcon,
  PlayIcon,
  SpeakerWaveIcon,
  XMarkIcon as XMarkIconOutline,
} from "@heroicons/react/24/outline";
import { cn, formatDuration } from "@/lib/utils";
import { mockScenarios } from "@/lib/mock-data";
import type { RoleplayCharacter } from "@/types";

type ConnectionStatus = "idle" | "connecting" | "connected" | "disconnected";

export default function ScenarioPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const scenario = useMemo(() => {
    return mockScenarios.find((s) => s.slug === slug);
  }, [slug]);

  const [selectedCharacter, setSelectedCharacter] = useState<RoleplayCharacter | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("idle");
  const [duration, setDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  const isInCall = connectionStatus === "connecting" || connectionStatus === "connected";

  const handleSelectCharacter = (character: RoleplayCharacter) => {
    if (isInCall) return;
    setSelectedCharacter(character);
    setConnectionStatus("idle");
    setDuration(0);
    setShowInfoPanel(false);
  };

  const handleStartCall = () => {
    if (!selectedCharacter) return;
    setConnectionStatus("connecting");
    setShowInfoPanel(false);

    setTimeout(() => {
      setConnectionStatus("connected");
      setIsSpeaking(true);

      const interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      setTimeout(() => {
        setIsSpeaking(false);
        setIsListening(true);
      }, 3000);

      (window as Window & { callInterval?: NodeJS.Timeout }).callInterval = interval;
    }, 2000);
  };

  const handleEndCall = () => {
    setConnectionStatus("disconnected");
    setIsSpeaking(false);
    setIsListening(false);
    setShowInfoPanel(false);
    const win = window as Window & { callInterval?: NodeJS.Timeout };
    if (win.callInterval) {
      clearInterval(win.callInterval);
    }
    
    // Redirecionar para analytics após 2 segundos
    setTimeout(() => {
      // Usar ID mockado baseado no personagem
      const roleplayId = selectedCharacter?.id?.split("-").pop() || "1";
      router.push(`/roleplays/${roleplayId}/analytics`);
    }, 2000);
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "Iniciante";
      case "intermediate":
        return "Intermediario";
      case "advanced":
        return "Avancado";
      default:
        return difficulty;
    }
  };

  const getCharacterBackground = (character: RoleplayCharacter | null) => {
    if (!character) return {};
    
    const role = character.role.toLowerCase();
    const context = character.context.toLowerCase();
    
    // B2B / TI - Azul tecnológico
    if (role.includes("ti") || role.includes("cto") || role.includes("ceo") || 
        context.includes("tecnologia") || context.includes("segurança") || context.includes("sistema")) {
      return {
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(46, 99, 205, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.06) 0%, transparent 50%),
          linear-gradient(135deg, rgba(219, 234, 254, 0.3) 0%, rgba(239, 246, 255, 0.5) 100%)
        `,
        backgroundSize: '100% 100%, 100% 100%, 100% 100%',
      };
    }
    
    // Financeiro / CFO - Azul escuro conservador
    if (role.includes("cfo") || role.includes("financ") || 
        context.includes("roi") || context.includes("investimento") || context.includes("orçamento")) {
      return {
        backgroundImage: `
          radial-gradient(circle at 15% 20%, rgba(30, 58, 138, 0.06) 0%, transparent 40%),
          radial-gradient(circle at 85% 80%, rgba(46, 99, 205, 0.05) 0%, transparent 40%),
          linear-gradient(135deg, rgba(224, 231, 255, 0.4) 0%, rgba(238, 242, 255, 0.6) 100%)
        `,
        backgroundSize: '100% 100%, 100% 100%, 100% 100%',
      };
    }
    
    // Atendimento / Suporte - Verde comunicação
    if (role.includes("cliente") || role.includes("consumidor") || role.includes("usuário") ||
        context.includes("atendimento") || context.includes("suporte") || context.includes("pedido")) {
      return {
        backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(52, 211, 153, 0.06) 0%, transparent 50%),
          linear-gradient(135deg, rgba(209, 250, 229, 0.3) 0%, rgba(236, 253, 245, 0.5) 100%)
        `,
        backgroundSize: '100% 100%, 100% 100%, 100% 100%',
      };
    }
    
    // Negociação / Compras - Laranja estratégia
    if (role.includes("compras") || role.includes("comercial") || role.includes("compradora") ||
        context.includes("negociar") || context.includes("preço") || context.includes("volume") || context.includes("fornecedor")) {
      return {
        backgroundImage: `
          radial-gradient(circle at 30% 40%, rgba(245, 158, 11, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 70% 60%, rgba(251, 191, 36, 0.06) 0%, transparent 50%),
          linear-gradient(135deg, rgba(254, 243, 199, 0.3) 0%, rgba(255, 251, 235, 0.5) 100%)
        `,
        backgroundSize: '100% 100%, 100% 100%, 100% 100%',
      };
    }
    
    // Cold Call / Prospecção - Roxo comunicação
    if (role.includes("gerente ocupado") || role.includes("assistente") || role.includes("cético") ||
        context.includes("prospecção") || context.includes("ligação") || context.includes("vendedor") || context.includes("agenda")) {
      return {
        backgroundImage: `
          radial-gradient(circle at 20% 35%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 65%, rgba(167, 139, 250, 0.06) 0%, transparent 50%),
          linear-gradient(135deg, rgba(237, 233, 254, 0.3) 0%, rgba(245, 243, 255, 0.5) 100%)
        `,
        backgroundSize: '100% 100%, 100% 100%, 100% 100%',
      };
    }
    
    // Fechamento / Decisão - Vermelho urgência
    if (role.includes("head") || role.includes("diretor") || role.includes("sócio") ||
        context.includes("fechamento") || context.includes("decisão") || context.includes("aprovação") || context.includes("proposta") || context.includes("concorrente")) {
      return {
        backgroundImage: `
          radial-gradient(circle at 25% 30%, rgba(239, 68, 68, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 75% 70%, rgba(248, 113, 113, 0.06) 0%, transparent 50%),
          linear-gradient(135deg, rgba(254, 226, 226, 0.3) 0%, rgba(255, 241, 242, 0.5) 100%)
        `,
        backgroundSize: '100% 100%, 100% 100%, 100% 100%',
      };
    }
    
    // Default - Neutro
    return {
      backgroundImage: `
        radial-gradient(circle at 50% 50%, rgba(156, 163, 175, 0.06) 0%, transparent 50%),
        linear-gradient(135deg, rgba(249, 250, 251, 0.5) 0%, rgba(255, 255, 255, 0.8) 100%)
      `,
      backgroundSize: '100% 100%, 100% 100%',
    };
  };

  if (!scenario) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-[#6B7280]">Cenario nao encontrado</p>
        <Button  onPress={() => router.push("/roleplays")}>
          Voltar para Role-plays
        </Button>
      </div>
    );
  }

  const renderInfoContent = () => {
    if (!selectedCharacter) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <Avatar
            src={selectedCharacter.avatar}
            name={selectedCharacter.name}
            className="w-16 h-16 text-xl flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-[#111827]">
                {selectedCharacter.name}
              </h3>
              <Chip
                size="sm"
                className={cn(
                  "text-xs font-medium",
                  selectedCharacter.difficulty === "beginner" && "bg-[#D1FAE5] text-[#065F46]",
                  selectedCharacter.difficulty === "intermediate" && "bg-[#FEF3C7] text-[#92400E]",
                  selectedCharacter.difficulty === "advanced" && "bg-[#FEE2E2] text-[#991B1B]"
                )}
              >
                {getDifficultyLabel(selectedCharacter.difficulty)}
              </Chip>
            </div>
            <p className="text-sm text-[#6B7280]">
              {selectedCharacter.role} - {selectedCharacter.company}
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wide mb-2">
            Personalidade
          </h4>
          <p className="text-sm text-[#6B7280]">{selectedCharacter.personality}</p>
        </div>

        <div>
          <h4 className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wide mb-2">
            Contexto
          </h4>
          <div className="bg-[#F9FAFB] rounded-xl p-4">
            <p className="text-sm text-[#6B7280]">{selectedCharacter.context}</p>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wide mb-3">
            Objetivos da sessao
          </h4>
          <div className="space-y-2">
            {selectedCharacter.objectives.map((objective, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-3 py-2 bg-[#F9FAFB] rounded-lg text-sm text-[#6B7280]"
              >
                <CheckCircleIcon className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                <span>{objective}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] flex-shrink-0">
        <h1 className="text-2xl font-semibold text-[#111827] mb-2">{scenario.name}</h1>
        <p className="text-sm text-[#6B7280]">{scenario.description}</p>
      </div>

      {/* Main content */}
      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        {/* Left panel - Character list */}
        <div className={cn(
          "w-96 bg-white rounded-2xl border border-[#E5E7EB] flex flex-col overflow-hidden transition-opacity duration-200 min-h-0",
          isInCall && "opacity-50 pointer-events-none"
        )}>
          <div className="p-6 pb-4 flex-shrink-0">
            <h2 className="text-sm font-medium text-[#6B7280] uppercase tracking-wide">
              Personagens ({scenario.characters.length})
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
            <div className="space-y-3">
              {scenario.characters.map((character) => (
                <Card
                  key={character.id}
                  isPressable
                  disableRipple={false}
                  onPress={() => handleSelectCharacter(character)}
                  className={cn(
                    "transition-all duration-200 w-full rounded-2xl overflow-hidden cursor-pointer",
                    selectedCharacter?.id === character.id
                      ? "bg-[#F0F4FA] border-2 border-[#bfd5ff] shadow-md"
                      : "bg-[#FAFAFA] hover:bg-white border border-[#E5E7EB] hover:border-[#C5D4ED]"
                  )}
                >
                  <CardBody className="p-4 relative">
                    <Chip
                      size="sm"
                      className={cn(
                        "absolute top-3 right-3 text-xs font-medium",
                        character.difficulty === "beginner" && "bg-[#D1FAE5] text-[#065F46]",
                        character.difficulty === "intermediate" && "bg-[#FEF3C7] text-[#92400E]",
                        character.difficulty === "advanced" && "bg-[#FEE2E2] text-[#991B1B]"
                      )}
                    >
                      {getDifficultyLabel(character.difficulty)}
                    </Chip>
                    <div className="flex items-start gap-3 pr-20">
                      <Avatar
                        src={character.avatar}
                        name={character.name}
                        className="w-12 h-12 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-[#111827] truncate">
                          {character.name}
                        </h3>
                        <p className="text-sm text-[#6B7280] truncate">
                          {character.role}
                        </p>
                        <p className="text-xs text-[#9CA3AF] truncate">
                          {character.company}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel - Info or Call */}
        <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
          {/* Main area */}
          <div className="flex-1 bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden flex flex-col min-h-0">
            {!selectedCharacter ? (
              /* Empty state */
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-24 h-24 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-4">
                  <UserIcon className="w-12 h-12 text-[#D1D5DB]" />
                </div>
                <h3 className="text-lg font-medium text-[#111827] mb-2">
                  Selecione um personagem
                </h3>
                <p className="text-[#6B7280] max-w-md">
                  Escolha um personagem na lista ao lado para ver os detalhes e iniciar uma sessao de pratica.
                </p>
              </div>
            ) : connectionStatus === "idle" ? (
              /* Info state - before call */
              <div className="h-full flex flex-col relative overflow-hidden" style={getCharacterBackground(selectedCharacter)}>
                {/* Tech pattern overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="tech-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                        <circle cx="30" cy="30" r="1.5" fill="currentColor" />
                        <circle cx="0" cy="0" r="1.5" fill="currentColor" />
                        <circle cx="60" cy="0" r="1.5" fill="currentColor" />
                        <circle cx="0" cy="60" r="1.5" fill="currentColor" />
                        <circle cx="60" cy="60" r="1.5" fill="currentColor" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#tech-grid)" />
                  </svg>
                </div>
                <div className="flex-1 overflow-y-auto p-16 pb-0 relative z-10">
                  <div className="max-w-2xl mx-auto pb-6">
                    {/* Character header */}
                    <div className="flex items-start gap-6 mb-8">
                      <Avatar
                        src={selectedCharacter.avatar}
                        name={selectedCharacter.name}
                        className="w-24 h-24 text-2xl flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="text-2xl font-semibold text-[#111827]">
                            {selectedCharacter.name}
                          </h2>
                          <Chip
                            size="sm"
                            className={cn(
                              "text-xs font-medium",
                              selectedCharacter.difficulty === "beginner" && "bg-[#D1FAE5] text-[#065F46]",
                              selectedCharacter.difficulty === "intermediate" && "bg-[#FEF3C7] text-[#92400E]",
                              selectedCharacter.difficulty === "advanced" && "bg-[#FEE2E2] text-[#991B1B]"
                            )}
                          >
                            {getDifficultyLabel(selectedCharacter.difficulty)}
                          </Chip>
                        </div>
                        <p className="text-[#6B7280]">
                          {selectedCharacter.role} - {selectedCharacter.company}
                        </p>
                      </div>
                    </div>

                    {/* Personality */}
                    <div className="mb-6">
                      <h4 className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wide mb-2">
                        Personalidade
                      </h4>
                      <p className="text-[#6B7280]">{selectedCharacter.personality}</p>
                    </div>

                    {/* Context */}
                    <div className="mb-6">
                      <h4 className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wide mb-2">
                        Contexto
                      </h4>
                      <div className="bg-[#F9FAFB] rounded-xl p-4">
                        <p className="text-[#6B7280]">{selectedCharacter.context}</p>
                      </div>
                    </div>

                    {/* Objectives */}
                    <div>
                      <h4 className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wide mb-3">
                        Objetivos da sessao
                      </h4>
                      <div className="grid gap-2">
                        {selectedCharacter.objectives.map((objective, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 px-4 py-3 bg-[#F9FAFB] rounded-xl text-[#6B7280]"
                          >
                            <CheckCircleIcon className="w-5 h-5 text-[#10B981] flex-shrink-0" />
                            <span>{objective}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call button - Fixed at bottom */}
                <div className="flex-shrink-0 p-6 border-t border-[#E5E7EB] bg-[#FAFAFA] relative z-10">
                  <div className="max-w-2xl mx-auto flex justify-center">
                    <Button
                      size="lg"
                      onPress={handleStartCall}
                      className="px-12 py-7 bg-gradient-to-r from-[#2E63CD] via-[#3B82F6] to-[#60A5FA] hover:from-[#2451A8] hover:via-[#2563EB] hover:to-[#3B82F6] text-white font-semibold text-lg rounded-2xl shadow-[0_8px_30px_rgb(46,99,205,0.4)] hover:shadow-[0_12px_40px_rgb(46,99,205,0.5)] transform hover:scale-105 transition-all duration-300 border-0 animate-pulse-subtle"
                    >
                      <PhoneIcon className="w-6 h-6" />
                      Iniciar Chamada
                    </Button>
                  </div>
                </div>
              </div>
            ) : connectionStatus === "connecting" ? (
              /* Connecting state */
              <div className="h-full flex flex-col items-center justify-center p-6 relative overflow-hidden" style={getCharacterBackground(selectedCharacter)}>
                {/* Tech pattern overlay */}
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="tech-connecting" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                        <line x1="0" y1="40" x2="80" y2="40" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
                        <line x1="40" y1="0" x2="40" y2="80" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
                        <circle cx="40" cy="40" r="2" fill="currentColor" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#tech-connecting)" />
                  </svg>
                </div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 rounded-full bg-[#bfd5ff]/10 animate-ping" />
                    <Avatar
                      src={selectedCharacter.avatar}
                      name={selectedCharacter.name}
                      className="w-32 h-32 text-3xl"
                    />
                  </div>
                  <h3 className="text-xl font-medium text-[#111827] mb-2">
                    Conectando com {selectedCharacter.name}...
                  </h3>
                  <p className="text-[#6B7280] mb-6">{selectedCharacter.role}</p>
                  <div className="max-w-xs w-full">
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#bfd5ff] animate-pulse w-full" />
                    </div>
                  </div>
                </div>
              </div>
            ) : connectionStatus === "connected" ? (
              /* In call state */
              <div className="h-full flex flex-col items-center justify-center p-6 relative overflow-hidden" style={getCharacterBackground(selectedCharacter)}>
                {/* Tech pattern overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="tech-connected" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                        <circle cx="20" cy="20" r="1" fill="currentColor" />
                        <circle cx="50" cy="50" r="1.5" fill="currentColor" />
                        <circle cx="80" cy="80" r="1" fill="currentColor" />
                        <path d="M20,20 L50,50 L80,80" stroke="currentColor" strokeWidth="0.3" opacity="0.3" fill="none" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#tech-connected)" />
                  </svg>
                </div>
                <div className="flex flex-col items-center justify-center max-w-md mx-auto text-center relative z-10">
                  {/* Status */}
                  <Chip
                    color={isSpeaking ? "primary" : isListening ? "success" : "default"}
                    variant="flat"
                    className="mb-8"
                  >
                    {isSpeaking ? "Falando..." : isListening ? "Ouvindo..." : "Conectado"}
                  </Chip>

                  {/* Avatar */}
                  <div className="relative inline-block mb-6">
                    <div
                      className={cn(
                        "absolute inset-0 rounded-full transition-all duration-300",
                        isSpeaking && "animate-pulse bg-[#bfd5ff]/20 scale-110"
                      )}
                    />
                    <Avatar
                      src={selectedCharacter.avatar}
                      name={selectedCharacter.name}
                      className="w-32 h-32 text-4xl"
                    />
                    {isSpeaking && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                        <SpeakerWaveIcon className="w-6 h-6 text-[#bfd5ff] animate-pulse" />
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="text-2xl font-semibold text-[#111827]">
                    {selectedCharacter.name}
                  </h3>
                  <p className="text-[#6B7280] mb-6">{selectedCharacter.role}</p>

                  {/* Waveform */}
                  <div className="flex items-center justify-center gap-1.5 h-12 mb-6">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-1.5 rounded-full bg-[#bfd5ff] transition-all",
                          (isSpeaking || isListening) ? "waveform-bar" : "h-2"
                        )}
                        style={{
                          animationDelay: `${i * 0.08}s`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Timer */}
                  <div className="text-4xl font-mono text-[#111827] mb-10">
                    {formatDuration(duration)}
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200",
                        isMuted
                          ? "bg-[#FEE2E2] text-[#991B1B] border-2 border-[#FECACA]"
                          : "bg-[#F5F5F5] text-[#6B7280] border border-[#E5E7EB] hover:bg-[#EBEBEB]"
                      )}
                    >
                      <MicrophoneIcon className="w-6 h-6" />
                    </button>

                    <button
                      onClick={handleEndCall}
                      className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[#EF4444] text-white border-2 border-[#DC2626] hover:bg-[#DC2626] transition-all duration-200"
                    >
                      <XMarkIcon className="w-7 h-7" />
                    </button>

                    <button
                      onClick={() => setIsPaused(!isPaused)}
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200",
                        isPaused
                          ? "bg-[#FEF3C7] text-[#92400E] border-2 border-[#FDE68A]"
                          : "bg-[#F5F5F5] text-[#6B7280] border border-[#E5E7EB] hover:bg-[#EBEBEB]"
                      )}
                    >
                      {isPaused ? (
                        <PlayIcon className="w-6 h-6" />
                      ) : (
                        <PauseIcon className="w-6 h-6" />
                      )}
                    </button>

                    <button
                      onClick={() => setShowInfoPanel(!showInfoPanel)}
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200",
                        showInfoPanel
                          ? "bg-[#EBF0FA] text-[#bfd5ff] border-2 border-[#C5D4ED]"
                          : "bg-[#F5F5F5] text-[#6B7280] border border-[#E5E7EB] hover:bg-[#EBEBEB]"
                      )}
                    >
                      <InformationCircleIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Disconnected state */
              <div className="h-full flex flex-col items-center justify-center p-6 relative overflow-hidden" style={getCharacterBackground(selectedCharacter)}>
                {/* Tech pattern overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="tech-disconnected" x="0" y="0" width="70" height="70" patternUnits="userSpaceOnUse">
                        <circle cx="35" cy="35" r="1" fill="currentColor" opacity="0.4" />
                        <circle cx="35" cy="35" r="15" stroke="currentColor" strokeWidth="0.3" opacity="0.2" fill="none" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#tech-disconnected)" />
                  </svg>
                </div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative inline-block mb-6">
                    <Avatar
                      src={selectedCharacter.avatar}
                      name={selectedCharacter.name}
                      className="w-32 h-32 text-3xl opacity-50"
                    />
                    <div className="absolute inset-0 rounded-full border-4 border-[#10B981] animate-ping" />
                  </div>
                  <h3 className="text-xl font-medium text-[#111827] mb-2">
                    Chamada encerrada
                  </h3>
                  <p className="text-[#6B7280] mb-2">
                    Duracao: {formatDuration(duration)}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span>Redirecionando para analytics...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Info side panel - only visible during call */}
          {showInfoPanel && connectionStatus === "connected" && selectedCharacter && (
            <div className="w-80 bg-white rounded-2xl border border-[#E5E7EB] flex flex-col overflow-hidden animate-fade-in min-h-0">
              <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between flex-shrink-0">
                <h3 className="font-medium text-[#111827]">Informacoes</h3>
                <Button
                  isIconOnly
                  variant="ghost"
                  size="sm"
                  className="rounded-lg hover:bg-[#F9FAFB] transition-colors"
                  onPress={() => setShowInfoPanel(false)}
                >
                  <XMarkIconOutline className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 min-h-0">
                {renderInfoContent()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
