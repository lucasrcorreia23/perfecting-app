import type { VoiceConfig, ConversationState } from "@/types";

const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1";

export class ElevenLabsClient {
  private apiKey: string;
  private defaultVoiceConfig: VoiceConfig;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.defaultVoiceConfig = {
      voiceId: "21m00Tcm4TlvDq8ikWAM", // Default voice (Rachel)
      stability: 0.5,
      similarityBoost: 0.75,
      style: 0.5,
      speakerBoost: true,
    };
  }

  async textToSpeech(text: string, voiceConfig?: Partial<VoiceConfig>): Promise<ArrayBuffer> {
    const config = { ...this.defaultVoiceConfig, ...voiceConfig };

    const response = await fetch(
      `${ELEVENLABS_API_URL}/text-to-speech/${config.voiceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": this.apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: config.stability,
            similarity_boost: config.similarityBoost,
            style: config.style,
            use_speaker_boost: config.speakerBoost,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    return response.arrayBuffer();
  }

  async textToSpeechStream(
    text: string,
    voiceConfig?: Partial<VoiceConfig>,
    onChunk?: (chunk: Uint8Array) => void
  ): Promise<void> {
    const config = { ...this.defaultVoiceConfig, ...voiceConfig };

    const response = await fetch(
      `${ELEVENLABS_API_URL}/text-to-speech/${config.voiceId}/stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": this.apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: config.stability,
            similarity_boost: config.similarityBoost,
            style: config.style,
            use_speaker_boost: config.speakerBoost,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body");
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (onChunk && value) {
        onChunk(value);
      }
    }
  }

  async getVoices(): Promise<Voice[]> {
    const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
      headers: {
        "xi-api-key": this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.voices;
  }
}

export interface Voice {
  voice_id: string;
  name: string;
  category: string;
  labels: Record<string, string>;
  description: string;
  preview_url: string;
}

// Singleton instance
let clientInstance: ElevenLabsClient | null = null;

export function getElevenLabsClient(): ElevenLabsClient {
  if (!clientInstance) {
    const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error("NEXT_PUBLIC_ELEVENLABS_API_KEY is not set");
    }
    clientInstance = new ElevenLabsClient(apiKey);
  }
  return clientInstance;
}

// Audio playback utilities
export class AudioPlayer {
  private audioContext: AudioContext | null = null;
  private audioQueue: AudioBuffer[] = [];
  private isPlaying = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.audioContext = new AudioContext();
    }
  }

  async playAudio(audioData: ArrayBuffer): Promise<void> {
    if (!this.audioContext) return;

    const audioBuffer = await this.audioContext.decodeAudioData(audioData);
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);
    source.start();

    return new Promise((resolve) => {
      source.onended = () => resolve();
    });
  }

  async playStream(chunks: Uint8Array[]): Promise<void> {
    if (!this.audioContext) return;

    const combined = new Uint8Array(
      chunks.reduce((acc, chunk) => acc + chunk.length, 0)
    );
    let offset = 0;
    for (const chunk of chunks) {
      combined.set(chunk, offset);
      offset += chunk.length;
    }

    await this.playAudio(combined.buffer);
  }
}

// Speech recognition utilities (browser-based)
// Type for SpeechRecognition API
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  onerror: ((event: ISpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  stop(): void;
}

interface ISpeechRecognitionEvent {
  results: ISpeechRecognitionResultList;
}

interface ISpeechRecognitionResultList {
  length: number;
  [index: number]: ISpeechRecognitionResult;
}

interface ISpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: ISpeechRecognitionAlternative;
}

interface ISpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface ISpeechRecognitionErrorEvent {
  error: string;
}

type SpeechRecognitionConstructor = new () => ISpeechRecognition;

export class SpeechRecognizer {
  private recognition: ISpeechRecognition | null = null;
  private isListening = false;

  constructor() {
    if (typeof window !== "undefined") {
      const SpeechRecognitionAPI = (
        window as Window & {
          SpeechRecognition?: SpeechRecognitionConstructor;
          webkitSpeechRecognition?: SpeechRecognitionConstructor;
        }
      ).SpeechRecognition || (
        window as Window & {
          webkitSpeechRecognition?: SpeechRecognitionConstructor;
        }
      ).webkitSpeechRecognition;

      if (SpeechRecognitionAPI) {
        this.recognition = new SpeechRecognitionAPI();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = "pt-BR";
      }
    }
  }

  start(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError?: (error: Error) => void
  ): void {
    if (!this.recognition) {
      onError?.(new Error("Speech recognition not supported"));
      return;
    }

    this.recognition.onresult = (event: ISpeechRecognitionEvent) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      onResult(transcript, result.isFinal);
    };

    this.recognition.onerror = (event: ISpeechRecognitionErrorEvent) => {
      onError?.(new Error(event.error));
    };

    this.recognition.start();
    this.isListening = true;
  }

  stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  get isActive(): boolean {
    return this.isListening;
  }
}
