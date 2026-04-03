export type EnglishLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type QuestionType =
  | "COMPREHENSION"
  | "VOCABULARY"
  | "INFERENCE"
  | "PERSONAL_RESPONSE"
  | "ANALYSIS";

export interface GeneratedQuestion {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswer?: string;
}

export interface PersistedQuestion {
  id: string;
  text: string;
  type: QuestionType;
  options: string[];
  correctAnswer: string | null;
  order: number;
}

export interface GeneratedStoryDraft {
  prompt: string;
  title: string;
  content: string;
  level: EnglishLevel;
}

export interface PersistedStory {
  id: string;
  title: string;
  content: string;
  prompt: string;
  level: EnglishLevel;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  questions: PersistedQuestion[];
}

export interface StoryListItem {
  id: string;
  title: string;
  content: string;
  level: EnglishLevel;
  createdAt: string;
  questionCount: number;
}

export interface GenerateStoryOptions {
  prompt: string;
  level: EnglishLevel;
}
