// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "admin" | "seller";
  groupId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Scenario Types
export type ScenarioType = "venda-b2b" | "atendimento" | "negociacao" | "cold-call" | "fechamento";

export interface RoleplayScenario {
  id: string;
  slug: ScenarioType;
  name: string;
  description: string;
  icon: string;
  color: string;
  characters: RoleplayCharacter[];
}

export interface RoleplayCharacter {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  personality: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  context: string;
  objectives: string[];
  voiceId: string;
}

// Roleplay Types
export type RoleplayCategory = "custom" | "behavioral" | "technical" | "objection" | "closing";

export interface RoleplayAgent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  voiceId: string;
  personality: string;
  context: string;
}

export interface Roleplay {
  id: string;
  title: string;
  description: string;
  category: RoleplayCategory;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedDuration: number;
  scenarioSlug: string;
  agent: RoleplayAgent;
  objectives: string[];
  objections?: ObjectionItem[];
  advanced?: AdvancedSettings;
  tags: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Session Types
export type SessionStatus = "pending" | "in_progress" | "completed" | "cancelled";

export interface RoleplaySession {
  id: string;
  roleplayId: string;
  userId: string;
  status: SessionStatus;
  startedAt?: Date;
  endedAt?: Date;
  duration?: number;
  transcript: TranscriptEntry[];
  feedback?: SessionFeedback;
}

export interface TranscriptEntry {
  id: string;
  speaker: "user" | "agent";
  content: string;
  timestamp: Date;
  sentiment?: "positive" | "neutral" | "negative";
}

// Feedback Types
export interface SessionFeedback {
  id: string;
  sessionId: string;
  overallScore: number;
  categories: FeedbackCategory[];
  highlights: FeedbackHighlight[];
  suggestions: string[];
  summary: string;
  createdAt: Date;
}

export interface FeedbackCategory {
  name: string;
  score: number;
  maxScore: number;
  feedback: string;
}

export interface FeedbackHighlight {
  type: "positive" | "improvement";
  content: string;
  transcriptEntryId?: string;
}

// Metrics Types
export interface UserMetrics {
  userId: string;
  totalSessions: number;
  completedSessions: number;
  averageScore: number;
  totalPracticeTime: number;
  streakDays: number;
  badges: Badge[];
  weeklyProgress: WeeklyProgress[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

export interface WeeklyProgress {
  week: string;
  sessions: number;
  averageScore: number;
}

// Group Types
export interface UserGroup {
  id: string;
  name: string;
  description?: string;
  adminId: string;
  memberIds: string[];
  assignedRoleplays: string[];
  createdAt: Date;
}

// Offer/Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  features: string[];
  price?: number;
  category: string;
  createdAt: Date;
}

// Leaderboard Types
export interface LeaderboardEntry {
  userId: string;
  userName: string;
  userAvatar?: string;
  rank: number;
  score: number;
  sessionsCompleted: number;
  improvement: number;
}

// Analytics Types
export interface SessionAnalytics {
  sessionId: string;
  talkListenRatio: {
    userTalkTime: number; // segundos
    agentTalkTime: number;
    ratio: number; // percentual do usuário
  };
  speechMetrics: {
    wordsPerMinute: number;
    averagePauseDuration: number;
    fillerWordsCount: number;
    fillerWords: string[]; // ["eh", "hmm", "tipo"]
  };
  engagement: {
    longestMonologue: number; // segundos
    interruptionsCount: number;
    questionsAsked: number;
  };
  recommendations: string[];
}

// Objections Types
export interface SessionObjections {
  sessionId: string;
  objectionsRaised: ObjectionEntry[];
  objectionsHandled: number;
  objectionsNotHandled: number;
  handlingQuality: "poor" | "fair" | "good" | "excellent";
  suggestions: string[];
}

export interface ObjectionEntry {
  id: string;
  type: "price" | "timing" | "authority" | "need" | "competitor" | "trust" | "other";
  content: string; // O que o agente disse
  userResponse: string; // Como o usuário respondeu
  wasHandled: boolean;
  handlingTechnique?: string; // Ex: "Feel, Felt, Found", "Reframe", "Question"
  feedback: string; // Feedback sobre como foi tratada
  transcriptEntryId: string; // Referência ao transcript
  timestamp: Date;
}

// User Session History Types
export interface UserSessionHistory {
  userId: string;
  sessions: SessionHistoryEntry[];
  overallStats: {
    totalSessions: number;
    averageScore: number;
    improvement: number; // percentual
    bestCategory: string;
    weakestCategory: string;
  };
}

export interface SessionHistoryEntry {
  sessionId: string;
  roleplayTitle: string;
  date: Date;
  score: number;
  duration: number;
  category: RoleplayCategory;
}

// Roleplay Creation Types
export interface RoleplayFormData {
  // Step 1: Descrição do Roleplay
  name: string;
  description: string; // Rich text description
  
  // Step 2: Contexto
  scenarioContext: string;
  
  // Step 3: Persona
  buyerPersona: BuyerPersona;
  
  // Step 4: Rubrica (Opcional) - Objetivos
  objectives?: string[]; // Lista de objetivos/metas
  
  // Step 5: Objeções (Opcional)
  objections?: ObjectionItem[];
  
  // Step 6: Avançado (Opcional)
  advanced?: AdvancedSettings;
}

export interface BuyerPersona {
  jobTitle: string;
  seniority: "junior" | "mid" | "senior" | "c-level";
  profile: "skeptical" | "neutral" | "receptive" | "enthusiastic";
  difficulty: "beginner" | "intermediate" | "advanced";
  personality: string; // Descrição do comportamento
}

export interface ObjectionItem {
  id: string;
  content: string;
  category?: "price" | "timing" | "authority" | "need" | "competitor" | "trust" | "other";
}

export interface AdvancedSettings {
  canAgentEndCall: boolean;
  maxDuration: number; // minutos
  interruptionLevel: "low" | "medium" | "high";
  agentMode: "challenging" | "balanced" | "collaborative";
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ElevenLabs Types
export interface VoiceConfig {
  voiceId: string;
  stability: number;
  similarityBoost: number;
  style?: number;
  speakerBoost?: boolean;
}

export interface ConversationState {
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  error?: string;
}

// Onboarding Types
export interface OnboardingFormData {
  // Step 2: Business Context
  business: {
    companyName: string;
    industry: string;
    teamSize: string;
    mainChallenge: string;
    trainingGoal: string;
  };

  // Step 3: Product
  product: {
    name: string;
    shortDescription: string;
    problemSolved: string;
    valueProposition: string;
    priceRange: string;
  };

  // Step 4: Buyer Persona
  buyer: {
    profileName: string;
    jobTitle: string;
    companySizes: string[];
    pains: string;
    objections: string;
    awarenessLevel: string;
  };

  // Step 5: Content
  content: {
    type: "upload" | "link" | "record";
    videoUrl?: string;
    uploadedFile?: File;
    duration?: string;
  };

  // Step 6: Generated Results
  generatedTrail?: GeneratedTrail;
  generatedScenarios?: GeneratedScenario[];

  // Step 7: Team
  team: {
    emails: string[];
    permissions: {
      accessTrails: boolean;
      accessRoleplays: boolean;
      createScenarios: boolean;
    };
    sendInvitesNow: boolean;
    scheduledDate?: Date;
    customMessage?: string;
  };
}

export interface GeneratedTrail {
  name: string;
  totalDuration: string;
  modules: TrailModule[];
}

export interface TrailModule {
  id: string;
  icon: string;
  title: string;
  duration: string;
  topics: string[];
}

export interface GeneratedScenario {
  id: string;
  type: string;
  icon: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  buyerName: string;
  buyerRole: string;
  objective: string;
  included: boolean;
}
