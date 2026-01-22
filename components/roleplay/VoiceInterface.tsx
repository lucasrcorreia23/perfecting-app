"use client";

import { useState, useEffect } from "react";
import { Button, Chip, Progress, Avatar } from "@heroui/react";
import {
  MicrophoneIcon,
  PauseIcon,
  PlayIcon,
  XMarkIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/solid";
import { cn, formatDuration } from "@/lib/utils";
import type { RoleplayAgent, ConversationState } from "@/types";

interface VoiceInterfaceProps {
  agent: RoleplayAgent;
  onEnd?: () => void;
  onTranscriptUpdate?: (transcript: { speaker: "user" | "agent"; content: string }[]) => void;
}

type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

export function VoiceInterface({ agent, onEnd, onTranscriptUpdate }: VoiceInterfaceProps) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting");
  const [conversationState, setConversationState] = useState<ConversationState>({
    isConnected: false,
    isListening: false,
    isSpeaking: false,
    isProcessing: false,
  });
  const [duration, setDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<{ speaker: "user" | "agent"; content: string }[]>([]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (connectionStatus === "connected" && !isPaused) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [connectionStatus, isPaused]);

  // Simulated connection effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setConnectionStatus("connected");
      setConversationState((prev) => ({ ...prev, isConnected: true }));
      // Simulate agent speaking first
      setTimeout(() => {
        setConversationState((prev) => ({ ...prev, isSpeaking: true }));
        const agentMessage = {
          speaker: "agent" as const,
          content: `Olá! Eu sou ${agent.name}, ${agent.role}. Como posso ajudá-lo hoje?`,
        };
        setTranscript([agentMessage]);
        onTranscriptUpdate?.([agentMessage]);
        setTimeout(() => {
          setConversationState((prev) => ({ ...prev, isSpeaking: false, isListening: true }));
        }, 3000);
      }, 500);
    }, 2000);
    return () => clearTimeout(timer);
  }, [agent, onTranscriptUpdate]);

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleTogglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleEndCall = () => {
    setConnectionStatus("disconnected");
    setConversationState({
      isConnected: false,
      isListening: false,
      isSpeaking: false,
      isProcessing: false,
    });
    onEnd?.();
  };

  const getStatusMessage = () => {
    if (connectionStatus === "connecting") return "Conectando...";
    if (connectionStatus === "error") return "Erro na conexão";
    if (conversationState.isSpeaking) return "Falando...";
    if (conversationState.isProcessing) return "Processando...";
    if (conversationState.isListening) return "Ouvindo...";
    return "Conectado";
  };

  const getStatusColor = (): "default" | "danger" | "warning" | "success" | "primary" => {
    if (connectionStatus === "connecting") return "warning";
    if (connectionStatus === "error") return "danger";
    if (conversationState.isSpeaking) return "primary";
    if (conversationState.isListening) return "success";
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
            conversationState.isSpeaking && "animate-pulse bg-[#2E63CD]/20 scale-110"
          )}
        />
        <Avatar
          name={agent.name}
          className="w-32 h-32 text-2xl ring-4 ring-offset-4 ring-[#2E63CD] transition-all duration-300"
        />
        {conversationState.isSpeaking && (
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
              conversationState.isSpeaking || conversationState.isListening
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
        {/* Mute button */}
        <Button
          isIconOnly
          className={cn(
            "w-14 h-14 rounded-full",
            isMuted ? "bg-red-500 text-white" : "bg-gray-200"
          )}
          onPress={handleToggleMute}
          isDisabled={connectionStatus !== "connected"}
          aria-label={isMuted ? "Ativar microfone" : "Silenciar microfone"}
        >
          <MicrophoneIcon className="w-6 h-6" />
        </Button>

        {/* End call button */}
        <Button
          isIconOnly
          className="w-16 h-16 rounded-full bg-red-500 text-white"
          onPress={handleEndCall}
          aria-label="Encerrar chamada"
        >
          <XMarkIcon className="w-8 h-8" />
        </Button>

        {/* Pause button */}
        <Button
          isIconOnly
          className={cn(
            "w-14 h-14 rounded-full",
            isPaused ? "bg-yellow-500 text-white" : "bg-gray-200"
          )}
          onPress={handleTogglePause}
          isDisabled={connectionStatus !== "connected"}
          aria-label={isPaused ? "Retomar" : "Pausar"}
        >
          {isPaused ? (
            <PlayIcon className="w-6 h-6" />
          ) : (
            <PauseIcon className="w-6 h-6" />
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
      {connectionStatus === "connecting" && (
        <div className="max-w-xs w-full">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#2E63CD] animate-pulse w-full" />
          </div>
        </div>
      )}
    </div>
  );
}
