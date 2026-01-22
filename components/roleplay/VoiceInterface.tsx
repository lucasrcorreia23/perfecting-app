"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button, Chip, Avatar } from "@heroui/react";
import {
  MicrophoneIcon,
  PauseIcon,
  PlayIcon,
  XMarkIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/solid";
import { cn, formatDuration } from "@/lib/utils";
import type { RoleplayAgent, TranscriptEntry, ConversationState } from "@/types";
import { useConversation } from "@elevenlabs/react";
import { generateId } from "@/lib/utils";

interface VoiceInterfaceProps {
  agent: RoleplayAgent;
  roleplayId?: string;
  onEnd?: () => void;
  onTranscriptUpdate?: (transcript: TranscriptEntry[]) => void;
  redirectToAnalytics?: boolean;
  useElevenLabsAgent?: boolean; // Usar ElevenLabs Agent (requer agentId configurado)
}

export function VoiceInterface({ 
  agent, 
  roleplayId,
  onEnd, 
  onTranscriptUpdate,
  redirectToAnalytics = true,
  useElevenLabsAgent = true, // Por padrão usa a integração oficial
}: VoiceInterfaceProps) {
  const router = useRouter();
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

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

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (conversation.status === 'connected') {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [conversation.status]);

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
    startConversation();
    return () => {
      if (conversation.status === 'connected') {
        conversation.endSession();
      }
    };
  }, []);

  const handleEndCall = () => {
    stopConversation();
  };

  const getStatusMessage = () => {
    if (error) return "Erro na conexão";
    if (isStarting || conversation.status === 'connecting') return "Conectando...";
    if (conversation.status === 'disconnected') return "Desconectado";
    if (conversation.isSpeaking) return "Falando...";
    return "Ouvindo...";
  };

  const getStatusColor = (): "default" | "danger" | "warning" | "success" | "primary" => {
    if (error) return "danger";
    if (isStarting || conversation.status === 'connecting') return "warning";
    if (conversation.status === 'disconnected') return "default";
    if (conversation.isSpeaking) return "primary";
    if (conversation.status === 'connected') return "success";
    return "default";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-8 space-y-8">
      {/* Connection status */}
      <Chip
        color={getStatusColor()}
        variant="flat"
        className="absolute top-4 right-4"
      >
        {getStatusMessage()}
      </Chip>

      {/* Agent avatar with animation */}
      <div className="relative">
        <div
          className={cn(
            "absolute inset-0 rounded-full transition-all duration-300",
            conversation.isSpeaking && "animate-pulse bg-[#2E63CD]/20 scale-110"
          )}
        />
        <Avatar
          src={agent.avatar}
          name={agent.name}
          className="w-32 h-32 text-2xl transition-all duration-300"
        />
        {conversation.isSpeaking && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
            <SpeakerWaveIcon className="w-6 h-6 text-[#2E63CD] animate-pulse" />
          </div>
        )}
      </div>

      {/* Agent info */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-semibold text-[#111827]">{agent.name}</h2>
        <p className="text-[#6B7280]">{agent.role}</p>
      </div>

      {/* Waveform visualization */}
      <div className="flex items-center justify-center gap-1 h-16">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-1 rounded-full bg-[#2E63CD] transition-all",
              conversation.status === 'connected'
                ? "waveform-bar"
                : "h-2"
            )}
            style={{
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>

      {/* Timer */}
      <div className="text-4xl font-mono text-[#111827]">
        {formatDuration(duration)}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Mute button - Não disponível no SDK oficial, mas podemos simular */}
        <Button
          isIconOnly
          className="w-14 h-14 rounded-full bg-gray-200"
          isDisabled={conversation.status !== 'connected'}
          aria-label="Microfone"
        >
          <MicrophoneIcon className="w-6 h-6" />
        </Button>

        {/* End call button */}
        <Button
          isIconOnly
          className="w-16 h-16 rounded-full bg-red-500 text-white"
          onPress={handleEndCall}
          isDisabled={conversation.status === 'disconnected'}
          aria-label="Encerrar chamada"
        >
          <XMarkIcon className="w-8 h-8" />
        </Button>

        {/* Status indicator */}
        <Button
          isIconOnly
          className="w-14 h-14 rounded-full bg-gray-200"
          isDisabled={true}
          aria-label="Status"
        >
          {conversation.isSpeaking ? (
            <SpeakerWaveIcon className="w-6 h-6 text-[#2E63CD]" />
          ) : (
            <MicrophoneIcon className="w-6 h-6 text-green-600" />
          )}
        </Button>
      </div>

      {/* Live transcript preview */}
      {transcript.length > 0 && (
        <div className="w-full max-w-md bg-[#F5F5F5] rounded-lg p-4 max-h-40 overflow-y-auto">
          <p className="text-xs text-[#6B7280] uppercase tracking-wide mb-2">
            Última mensagem
          </p>
          <p className="text-sm text-[#1F2937]">
            <span className="font-medium">
              {transcript[transcript.length - 1].speaker === "agent"
                ? agent.name
                : "Você"}
              :{" "}
            </span>
            {transcript[transcript.length - 1].content}
          </p>
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
  );
}
