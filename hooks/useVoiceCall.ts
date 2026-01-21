"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { ConversationState, TranscriptEntry, RoleplayAgent } from "@/types";
import { generateId } from "@/lib/utils";

interface UseVoiceCallOptions {
  agent: RoleplayAgent;
  onTranscriptUpdate?: (transcript: TranscriptEntry[]) => void;
  onSessionEnd?: (transcript: TranscriptEntry[], duration: number) => void;
}

interface UseVoiceCallReturn {
  conversationState: ConversationState;
  transcript: TranscriptEntry[];
  duration: number;
  connect: () => Promise<void>;
  disconnect: () => void;
  toggleMute: () => void;
  togglePause: () => void;
  isMuted: boolean;
  isPaused: boolean;
  error: string | null;
}

export function useVoiceCall({
  agent,
  onTranscriptUpdate,
  onSessionEnd,
}: UseVoiceCallOptions): UseVoiceCallReturn {
  const [conversationState, setConversationState] = useState<ConversationState>({
    isConnected: false,
    isListening: false,
    isSpeaking: false,
    isProcessing: false,
  });
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Timer effect
  useEffect(() => {
    if (conversationState.isConnected && !isPaused) {
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [conversationState.isConnected, isPaused]);

  // Update transcript callback
  useEffect(() => {
    onTranscriptUpdate?.(transcript);
  }, [transcript, onTranscriptUpdate]);

  const addTranscriptEntry = useCallback(
    (speaker: "user" | "agent", content: string) => {
      const entry: TranscriptEntry = {
        id: generateId(),
        speaker,
        content,
        timestamp: new Date(),
      };
      setTranscript((prev) => [...prev, entry]);
    },
    []
  );

  const connect = useCallback(async () => {
    try {
      setError(null);
      setConversationState((prev) => ({ ...prev, isProcessing: true }));

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Initialize audio context
      audioContextRef.current = new AudioContext();

      // Set up media recorder for voice input
      mediaRecorderRef.current = new MediaRecorder(stream);

      // Simulate connection
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setConversationState({
        isConnected: true,
        isListening: false,
        isSpeaking: true,
        isProcessing: false,
      });

      // Simulate agent greeting
      setTimeout(() => {
        addTranscriptEntry(
          "agent",
          `Olá! Eu sou ${agent.name}, ${agent.role}. Como posso ajudá-lo hoje?`
        );
        setTimeout(() => {
          setConversationState((prev) => ({
            ...prev,
            isSpeaking: false,
            isListening: true,
          }));
        }, 2000);
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao conectar");
      setConversationState({
        isConnected: false,
        isListening: false,
        isSpeaking: false,
        isProcessing: false,
        error: err instanceof Error ? err.message : "Erro ao conectar",
      });
    }
  }, [agent, addTranscriptEntry]);

  const disconnect = useCallback(() => {
    // Stop media recorder
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Call session end callback
    onSessionEnd?.(transcript, duration);

    // Reset state
    setConversationState({
      isConnected: false,
      isListening: false,
      isSpeaking: false,
      isProcessing: false,
    });
  }, [transcript, duration, onSessionEnd]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  return {
    conversationState,
    transcript,
    duration,
    connect,
    disconnect,
    toggleMute,
    togglePause,
    isMuted,
    isPaused,
    error,
  };
}
