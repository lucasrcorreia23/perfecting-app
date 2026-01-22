"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { ConversationState, TranscriptEntry, RoleplayAgent } from "@/types";
import { generateId } from "@/lib/utils";
import { getElevenLabsClient, SpeechRecognizer } from "@/lib/elevenlabs";

interface UseVoiceCallOptions {
  agent: RoleplayAgent;
  onTranscriptUpdate?: (transcript: TranscriptEntry[]) => void;
  onSessionEnd?: (transcript: TranscriptEntry[], duration: number) => void;
  useRealVoice?: boolean; // Flag para ativar integração real
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
  useRealVoice = false,
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
  const speechRecognizerRef = useRef<SpeechRecognizer | null>(null);
  const elevenLabsClientRef = useRef<ReturnType<typeof getElevenLabsClient> | null>(null);
  const isProcessingUserSpeechRef = useRef(false);

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
      return entry;
    },
    []
  );

  // Reproduzir áudio usando ElevenLabs
  const playAgentSpeech = useCallback(async (text: string) => {
    if (!useRealVoice || !elevenLabsClientRef.current || !audioContextRef.current) {
      return;
    }

    try {
      setConversationState((prev) => ({ ...prev, isSpeaking: true, isListening: false }));

      // Gerar áudio com ElevenLabs
      const audioData = await elevenLabsClientRef.current.textToSpeech(text, {
        voiceId: agent.voiceId,
        stability: 0.5,
        similarityBoost: 0.75,
      });

      // Decodificar e reproduzir
      const audioBuffer = await audioContextRef.current.decodeAudioData(audioData);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);

      // Quando terminar de falar, voltar a ouvir
      source.onended = () => {
        setConversationState((prev) => ({ ...prev, isSpeaking: false, isListening: true }));
        // Retomar reconhecimento de voz
        if (speechRecognizerRef.current && !isPaused) {
          speechRecognizerRef.current.start(handleUserSpeech, handleSpeechError);
        }
      };

      source.start();
    } catch (err) {
      console.error("Erro ao reproduzir áudio:", err);
      setError("Erro ao reproduzir áudio do agente");
      setConversationState((prev) => ({ ...prev, isSpeaking: false, isListening: true }));
    }
  }, [useRealVoice, agent.voiceId, isPaused]);

  // Processar fala do usuário
  const processUserSpeech = useCallback(async (userText: string) => {
    if (isProcessingUserSpeechRef.current) return;
    
    isProcessingUserSpeechRef.current = true;
    
    try {
      // Parar reconhecimento de voz temporariamente
      if (speechRecognizerRef.current) {
        speechRecognizerRef.current.stop();
      }

      setConversationState((prev) => ({ ...prev, isProcessing: true, isListening: false }));

      // Adicionar fala do usuário ao transcript
      addTranscriptEntry("user", userText);

      // Simular resposta do agente (aqui você pode integrar com LLM/GPT)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Gerar resposta baseada no contexto do agente
      const agentResponse = generateAgentResponse(userText, agent);
      
      // Adicionar resposta ao transcript
      addTranscriptEntry("agent", agentResponse);

      setConversationState((prev) => ({ ...prev, isProcessing: false }));

      // Reproduzir resposta usando ElevenLabs
      if (useRealVoice) {
        await playAgentSpeech(agentResponse);
      } else {
        // Modo simulação
        setConversationState((prev) => ({ ...prev, isSpeaking: true }));
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setConversationState((prev) => ({ ...prev, isSpeaking: false, isListening: true }));
        if (speechRecognizerRef.current) {
          speechRecognizerRef.current.start(handleUserSpeech, handleSpeechError);
        }
      }
    } catch (err) {
      console.error("Erro ao processar fala:", err);
      setError("Erro ao processar sua fala");
    } finally {
      isProcessingUserSpeechRef.current = false;
    }
  }, [useRealVoice, agent, addTranscriptEntry, playAgentSpeech]);

  // Handler para reconhecimento de voz
  const handleUserSpeech = useCallback((transcript: string, isFinal: boolean) => {
    if (isFinal && transcript.trim() && !isPaused) {
      processUserSpeech(transcript);
    }
  }, [isPaused, processUserSpeech]);

  // Handler para erros de reconhecimento
  const handleSpeechError = useCallback((err: Error) => {
    console.error("Erro no reconhecimento de voz:", err);
    setError("Erro no reconhecimento de voz. Verifique as permissões do microfone.");
  }, []);

  const connect = useCallback(async () => {
    try {
      setError(null);
      setConversationState((prev) => ({ ...prev, isProcessing: true }));

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Initialize audio context
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      // Set up media recorder for voice input
      mediaRecorderRef.current = new MediaRecorder(stream);

      // Inicializar ElevenLabs se modo real estiver ativo
      if (useRealVoice) {
        try {
          elevenLabsClientRef.current = getElevenLabsClient();
        } catch (err) {
          console.warn("ElevenLabs não configurado, usando modo simulação:", err);
          setError("Aviso: API ElevenLabs não configurada. Configure NEXT_PUBLIC_ELEVENLABS_API_KEY no .env.local");
        }
      }

      // Inicializar reconhecedor de voz
      speechRecognizerRef.current = new SpeechRecognizer();

      // Simulate connection
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setConversationState({
        isConnected: true,
        isListening: false,
        isSpeaking: true,
        isProcessing: false,
      });

      // Greeting do agente
      const greeting = `Olá! Eu sou ${agent.name}, ${agent.role}. ${agent.context || "Como posso ajudá-lo hoje?"}`;
      addTranscriptEntry("agent", greeting);

      if (useRealVoice && elevenLabsClientRef.current) {
        // Reproduzir greeting com ElevenLabs
        await playAgentSpeech(greeting);
      } else {
        // Modo simulação
        setTimeout(() => {
          setConversationState((prev) => ({
            ...prev,
            isSpeaking: false,
            isListening: true,
          }));
          // Iniciar reconhecimento de voz
          if (speechRecognizerRef.current) {
            speechRecognizerRef.current.start(handleUserSpeech, handleSpeechError);
          }
        }, 2000);
      }
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
  }, [agent, addTranscriptEntry, useRealVoice, playAgentSpeech, handleUserSpeech, handleSpeechError]);

  const disconnect = useCallback(() => {
    // Stop speech recognizer
    if (speechRecognizerRef.current) {
      speechRecognizerRef.current.stop();
      speechRecognizerRef.current = null;
    }

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
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    if (newMutedState && speechRecognizerRef.current) {
      speechRecognizerRef.current.stop();
    } else if (!newMutedState && conversationState.isListening && speechRecognizerRef.current) {
      speechRecognizerRef.current.start(handleUserSpeech, handleSpeechError);
    }
  }, [isMuted, conversationState.isListening, handleUserSpeech, handleSpeechError]);

  const togglePause = useCallback(() => {
    const newPausedState = !isPaused;
    setIsPaused(newPausedState);

    if (newPausedState && speechRecognizerRef.current) {
      speechRecognizerRef.current.stop();
    } else if (!newPausedState && conversationState.isListening && speechRecognizerRef.current) {
      speechRecognizerRef.current.start(handleUserSpeech, handleSpeechError);
    }
  }, [isPaused, conversationState.isListening, handleUserSpeech, handleSpeechError]);

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

// Função auxiliar para gerar respostas do agente (simulação simples)
// Em produção, isso seria substituído por chamada a LLM (GPT-4, etc.)
function generateAgentResponse(userText: string, agent: RoleplayAgent): string {
  const lowerText = userText.toLowerCase();

  // Respostas contextuais baseadas no que o usuário disse
  if (lowerText.includes("preço") || lowerText.includes("caro") || lowerText.includes("custo")) {
    return "Entendo sua preocupação com o investimento. Vamos conversar sobre o valor que nossa solução pode trazer para sua empresa?";
  }

  if (lowerText.includes("não") || lowerText.includes("não preciso")) {
    return "Compreendo. Posso perguntar o que te faz pensar assim? Talvez eu possa esclarecer alguns pontos.";
  }

  if (lowerText.includes("obrigado") || lowerText.includes("valeu")) {
    return "Por nada! Fico feliz em poder ajudar. Tem mais alguma dúvida?";
  }

  if (lowerText.includes("sim") || lowerText.includes("interesse")) {
    return "Ótimo! Vamos então avançar. Qual seria o próximo passo ideal para você?";
  }

  // Resposta padrão contextualizada
  const responses = [
    "Interessante. Pode me contar mais sobre isso?",
    "Entendo. E como você vê isso impactando seu negócio?",
    "Boa pergunta. Deixe-me explicar melhor esse ponto.",
    "Compreendo sua perspectiva. Vamos explorar isso juntos?",
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}
