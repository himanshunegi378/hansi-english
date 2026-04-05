export type EnglishLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type QuestionType =
  | "COMPREHENSION"
  | "VOCABULARY"
  | "INFERENCE"
  | "PERSONAL_RESPONSE"
  | "ANALYSIS";

export type AnswerValueType = "OPTION" | "TEXT" | "BOOLEAN";

export interface StoryAnswerValue {
  valueType: AnswerValueType;
  selectedOption?: string | null;
  textAnswer?: string | null;
  booleanAnswer?: boolean | null;
}

export interface StoryQuestionAnswer extends StoryAnswerValue {
  questionId: string;
  isCorrect: boolean;
  pointsEarned: number;
  feedback?: string | null;
}

export interface StoryProgress {
  id: string;
  earnedPoints: number;
  totalPoints: number;
  completedAt?: string | null;
  lastAnsweredAt?: string | null;
  answers: StoryQuestionAnswer[];
}

export interface GeneratedQuestion {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswer?: string;
  valueType: AnswerValueType;
}

export interface PersistedQuestion {
  id: string;
  text: string;
  type: QuestionType;
  options: string[];
  correctAnswer: string | null;
  order: number;
  valueType: AnswerValueType;
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
  viewerProgress?: StoryProgress | null;
}

export interface StoryListItem {
  id: string;
  title: string;
  content: string;
  level: EnglishLevel;
  createdAt: string;
  questionCount: number;
  earnedPoints?: number;
  totalPoints?: number;
  isCompleted?: boolean;
}

export interface GenerateStoryOptions {
  prompt: string;
  level: EnglishLevel;
}

export interface SubmitStoryAnswerInput extends StoryAnswerValue {
  questionId: string;
  storyId: string;
}

export interface StoryQuizSharedProps {
  /**
   * Whether to persist quiz answers to the database (true for logged-in users)
   * or only grade them locally in-memory (false for guest visitors).
   */
  canSaveProgress: boolean;
  initialProgress?: StoryProgress | null;
  questions: GeneratedQuestion[];
  storyId: string;
}

