"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button, Chip, Card, CardBody, Avatar } from "@heroui/react";
import {
  MicrophoneIcon,
  XMarkIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { XMarkIcon as XMarkIconOutline } from "@heroicons/react/24/outline";
import { cn, formatDuration } from "@/lib/utils";
import type { RoleplayAgent, TranscriptEntry } from "@/types";
import { useConversation } from "@elevenlabs/react";
import { generateId } from "@/lib/utils";
import { Orb } from "@/components/ui/orb";

interface VoiceInterfaceProps {
  agent: RoleplayAgent;
  roleplayId?: string;
  onEnd?: () => void;
  onTranscriptUpdate?: (transcript: TranscriptEntry[]) => void;
  redirectToAnalytics?: boolean;
  useElevenLabsAgent?: boolean; // Usar ElevenLabs Agent (requer agentId configurado)
  demoMode?: boolean; // Modo demo/mock sem API real
}

export function VoiceInterface({ 
  agent, 
  roleplayId,
  onEnd, 
  onTranscriptUpdate,
  redirectToAnalytics = true,
  useElevenLabsAgent = true, // Por padrão usa a integração oficial
  demoMode = false, // Modo demo sem API
}: VoiceInterfaceProps) {
  const router = useRouter();
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  
  // Estados para modo demo
  const [demoStatus, setDemoStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [demoIsSpeaking, setDemoIsSpeaking] = useState(false);
  
  // Estado para offcanvas de informações
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  // Hook oficial da ElevenLabs
  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs Agent');
      setError(null);
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs Agent');
      handleSessionEnd();
    },
    onMessage: (message) => {
      console.log('Message:', message);
      
      // Adicionar mensagem ao transcript
      const entry: TranscriptEntry = {
        id: generateId(),
        speaker: message.source === 'ai' ? 'agent' : 'user',
        content: message.message,
        timestamp: new Date(),
      };
      
      setTranscript((prev) => {
        const updated = [...prev, entry];
        onTranscriptUpdate?.(updated);
        return updated;
      });
    },
    onError: (error) => {
      console.error('Conversation error:', error);
      setError(`Erro na conversação: ${error}`);
    },
  });

  // Timer - funciona tanto em modo real quanto demo
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const isConnected = demoMode 
      ? demoStatus === 'connected' 
      : conversation.status === 'connected';
    
    if (isConnected) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [demoMode, demoStatus, conversation.status]);

  // Função para buscar signed URL
  const getSignedUrl = async (): Promise<string> => {
    const response = await fetch("/api/get-signed-url");
    if (!response.ok) {
      throw new Error(`Failed to get signed URL: ${response.statusText}`);
    }
    const { signedUrl } = await response.json();
    return signedUrl;
  };

  // Iniciar conversação
  const startConversation = useCallback(async () => {
    try {
      setIsStarting(true);
      setError(null);

      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      if (useElevenLabsAgent) {
        // Usar ElevenLabs Agent com signed URL
        const signedUrl = await getSignedUrl();
        await conversation.startSession({
          signedUrl,
        });
      } else {
        // Fallback: usar agentId público se disponível
        const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
        if (!agentId) {
          throw new Error('Agent ID not configured');
        }
        
        await conversation.startSession({
          agentId,
          connectionType: 'webrtc',
        });
      }
    } catch (err) {
      console.error('Failed to start conversation:', err);
      setError(err instanceof Error ? err.message : 'Erro ao iniciar conversação');
    } finally {
      setIsStarting(false);
    }
  }, [conversation, useElevenLabsAgent]);

  // Encerrar conversação
  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  // Handler para fim da sessão
  const handleSessionEnd = () => {
    onEnd?.();
    if (redirectToAnalytics && roleplayId) {
      setTimeout(() => {
        router.push(`/roleplays/${roleplayId}/analytics`);
      }, 2000);
    }
  };

  // Auto-start ao montar
  useEffect(() => {
    if (!demoMode) {
      startConversation();
      return () => {
        if (conversation.status === 'connected') {
          conversation.endSession();
        }
      };
    }
  }, [demoMode]);

  // Modo Demo - Simulação sem API
  useEffect(() => {
    if (!demoMode) return;

    // Simular conexão
    const connectTimer = setTimeout(() => {
      setDemoStatus('connected');
      
      // Adicionar mensagem inicial do agente
      const welcomeMessage: TranscriptEntry = {
        id: generateId(),
        speaker: 'agent',
        content: `Olá! Sou ${agent.name}. Como posso ajudá-lo hoje?`,
        timestamp: new Date(),
      };
      setTranscript([welcomeMessage]);
      onTranscriptUpdate?.([welcomeMessage]);
    }, 2000);

    // Simular alternância entre falando/ouvindo
    const speakingInterval = setInterval(() => {
      if (demoStatus === 'connected') {
        setDemoIsSpeaking(prev => {
          const newState = !prev;
          
          // Adicionar mensagens mockadas durante a conversa
          if (newState) {
            // Agente falando
            setTimeout(() => {
              const agentMessages = [
                "Entendo sua preocupação. Vamos explorar isso juntos.",
                "Excelente ponto! Isso é muito importante no contexto de vendas.",
                "Posso sugerir uma abordagem diferente para essa situação?",
                "Com base no que você disse, vejo algumas oportunidades aqui.",
              ];
              const randomMessage = agentMessages[Math.floor(Math.random() * agentMessages.length)];
              
              setTranscript(prev => {
                const updated = [...prev, {
                  id: generateId(),
                  speaker: 'agent' as const,
                  content: randomMessage,
                  timestamp: new Date(),
                }];
                onTranscriptUpdate?.(updated);
                return updated;
              });
            }, 1000);
          } else {
            // Usuário falando (simulado)
            setTimeout(() => {
              const userMessages = [
                "Como eu posso lidar com essa objeção?",
                "Qual seria a melhor forma de abordar esse cliente?",
                "Preciso de ajuda com o fechamento da venda.",
                "O cliente está hesitante, o que devo fazer?",
              ];
              const randomMessage = userMessages[Math.floor(Math.random() * userMessages.length)];
              
              setTranscript(prev => {
                const updated = [...prev, {
                  id: generateId(),
                  speaker: 'user' as const,
                  content: randomMessage,
                  timestamp: new Date(),
                }];
                onTranscriptUpdate?.(updated);
                return updated;
              });
            }, 500);
          }
          
          return newState;
        });
      }
    }, 5000);

    return () => {
      clearTimeout(connectTimer);
      clearInterval(speakingInterval);
    };
  }, [demoMode, demoStatus, agent.name]);

  const handleEndCall = () => {
    if (demoMode) {
      setDemoStatus('disconnected');
      handleSessionEnd();
    } else {
      stopConversation();
    }
  };

  const getStatusMessage = () => {
    if (demoMode) {
      if (demoStatus === 'connecting') return "Conectando... (Demo)";
      if (demoStatus === 'disconnected') return "Desconectado";
      if (demoIsSpeaking) return "Falando...";
      return "Ouvindo...";
    }
    
    if (error) return "Erro na conexão";
    if (isStarting || conversation.status === 'connecting') return "Conectando...";
    if (conversation.status === 'disconnected') return "Desconectado";
    if (conversation.isSpeaking) return "Falando...";
    return "Ouvindo...";
  };

  const getStatusColor = (): "default" | "danger" | "warning" | "success" | "primary" => {
    if (demoMode) {
      if (demoStatus === 'connecting') return "warning";
      if (demoStatus === 'disconnected') return "default";
      if (demoIsSpeaking) return "primary";
      if (demoStatus === 'connected') return "success";
      return "default";
    }
    
    if (error) return "danger";
    if (isStarting || conversation.status === 'connecting') return "warning";
    if (conversation.status === 'disconnected') return "default";
    if (conversation.isSpeaking) return "primary";
    if (conversation.status === 'connected') return "success";
    return "default";
  };

  return (
    <div className="relative flex gap-4 min-h-[600px] w-full">
      {/* Main content */}
      <div className={cn(
        "flex-1 flex flex-col items-center justify-center p-8 transition-all duration-300",
        showInfoPanel && "mr-80"
      )}>
      {/* Connection status */}
      <Chip
        color={getStatusColor()}
        variant="flat"
        className="absolute top-4 right-4"
      >
        {getStatusMessage()}
      </Chip>

      {/* Orb - elemento principal */}
      <div className="flex flex-col items-center gap-6 mb-8">
        <Orb
          isActive={demoMode ? demoStatus === 'connected' : conversation.status === 'connected'}
          isSpeaking={demoMode ? demoIsSpeaking : conversation.isSpeaking}
          agentState={
            demoMode
              ? (demoIsSpeaking ? "talking" : demoStatus === 'connected' ? "listening" : null)
              : (conversation.isSpeaking ? "talking" : conversation.status === 'connected' ? "listening" : null)
          }
          size="large"
          colors={["#2E63CD", "#60A5FA"]}
        />
        
        {/* Agent info abaixo do Orb */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#111827]">{agent.name}</h2>
          <p className="text-[#6B7280]">{agent.role}</p>
        </div>
      </div>

      {/* Timer */}
      <div className="text-4xl font-mono text-[#111827] mb-8">
        {formatDuration(duration)}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-8">
        {/* Mic indicator */}
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
          <MicrophoneIcon 
            className={cn(
              "w-5 h-5 transition-colors",
              (demoMode ? demoStatus === 'connected' : conversation.status === 'connected') ? "text-green-600" : "text-gray-400"
            )} 
          />
          <span className="text-sm font-medium text-gray-700">
            {(demoMode ? demoStatus === 'connected' : conversation.status === 'connected') ? 'Ativo' : 'Inativo'}
          </span>
        </div>

        {/* End call button */}
        <Button
          isIconOnly
          className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg"
          onPress={handleEndCall}
          isDisabled={demoMode ? demoStatus === 'disconnected' : conversation.status === 'disconnected'}
          aria-label="Encerrar chamada"
        >
          <XMarkIcon className="w-8 h-8" />
        </Button>

        {/* Info button */}
        <Button
          isIconOnly
          className={cn(
            "w-14 h-14 rounded-full transition-colors shadow-md",
            showInfoPanel
              ? "bg-[#2E63CD] text-white hover:bg-[#1E4FB8]"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
          onPress={() => setShowInfoPanel(!showInfoPanel)}
          aria-label="Informações do personagem"
        >
          <InformationCircleIcon className="w-7 h-7" />
        </Button>
      </div>

      {/* Live transcript preview */}
      {transcript.length > 0 && (
        <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-xs text-[#6B7280] uppercase tracking-wide mb-3 font-semibold">
            Transcrição ao vivo
          </p>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {transcript.slice(-3).map((entry, index) => (
              <div key={entry.id} className={cn(
                "flex gap-3 p-3 rounded-lg",
                entry.speaker === "agent" ? "bg-blue-50" : "bg-gray-50"
              )}>
                <div className="flex-shrink-0">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold",
                    entry.speaker === "agent" 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-600 text-white"
                  )}>
                    {entry.speaker === "agent" ? "AI" : "Eu"}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {entry.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connection progress */}
      {(isStarting || conversation.status === 'connecting') && !error && (
        <div className="max-w-xs w-full">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#2E63CD] animate-pulse w-full" />
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
          <p className="text-xs text-red-600 mt-2">
            Configure ELEVENLABS_API_KEY e NEXT_PUBLIC_ELEVENLABS_AGENT_ID no .env.local
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Consulte ELEVENLABS_OFFICIAL_SETUP.md para instruções
          </p>
        </div>
      )}
      </div>

      {/* Info Panel (Offcanvas) */}
      {showInfoPanel && (
        <div className="fixed top-0 right-0 h-full w-80 bg-white border-l border-gray-200 shadow-2xl z-50 animate-slide-in-right overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
            <h3 className="text-lg font-semibold text-[#111827]">Informações do Personagem</h3>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="rounded-lg hover:bg-gray-100"
              onPress={() => setShowInfoPanel(false)}
              aria-label="Fechar painel"
            >
              <XMarkIconOutline className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Avatar e Nome */}
            <div className="flex flex-col items-center text-center gap-4">
              <Avatar
                src={agent.avatar}
                name={agent.name}
                className="w-24 h-24 text-2xl"
              />
              <div>
                <h4 className="text-xl font-semibold text-[#111827]">{agent.name}</h4>
                <p className="text-sm text-[#6B7280] mt-1">{agent.role}</p>
              </div>
            </div>

            {/* Nível de Dificuldade */}
            {('difficulty' in agent) && (agent as any).difficulty && (
              <Card className="bg-gray-50 shadow-none">
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#6B7280]">Dificuldade</span>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={
                        (agent as any).difficulty === 'beginner' ? 'success' :
                        (agent as any).difficulty === 'intermediate' ? 'warning' :
                        'danger'
                      }
                      className="font-semibold"
                    >
                      {(agent as any).difficulty === 'beginner' ? 'Iniciante' :
                       (agent as any).difficulty === 'intermediate' ? 'Intermediário' :
                       'Avançado'}
                    </Chip>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Personalidade */}
            {agent.personality && (
              <div>
                <h5 className="text-sm font-semibold text-[#111827] mb-3">Personalidade</h5>
                <div className="bg-blue-50 text-blue-900 rounded-lg p-3 text-sm leading-relaxed">
                  {typeof agent.personality === 'string' 
                    ? agent.personality 
                    : Array.isArray(agent.personality) 
                      ? (agent.personality as string[]).join(', ') 
                      : 'N/A'
                  }
                </div>
              </div>
            )}

            {/* Objetivos */}
            {('objectives' in agent) && (agent as any).objectives && Array.isArray((agent as any).objectives) && (agent as any).objectives.length > 0 ? (
              <div>
                <h5 className="text-sm font-semibold text-[#111827] mb-3">Objetivos</h5>
                <ul className="space-y-2">
                  {(agent as any).objectives.map((objective: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-[#6B7280]">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Tempo de Chamada */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-none border border-blue-200">
              <CardBody className="p-4">
                <div className="text-center">
                  <p className="text-xs text-blue-700 font-medium mb-1">Tempo de Chamada</p>
                  <p className="text-3xl font-mono font-bold text-blue-900">
                    {formatDuration(duration)}
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Dicas */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h5 className="text-sm font-semibold text-amber-900 mb-2 flex items-center gap-2">
                <InformationCircleIcon className="w-4 h-4" />
                Dicas
              </h5>
              <ul className="space-y-2 text-xs text-amber-800">
                <li>• Seja claro e objetivo nas suas respostas</li>
                <li>• Ouça atentamente as objeções do cliente</li>
                <li>• Mantenha um tom profissional e empático</li>
                <li>• Adapte sua abordagem ao perfil do personagem</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
