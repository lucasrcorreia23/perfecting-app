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
