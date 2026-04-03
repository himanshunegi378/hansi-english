export type EnglishLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface Story {
  id: string;
  title: string;
  content: string;
  level: EnglishLevel;
  questions: Question[];
  createdAt: Date;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswer?: string;
}

export type QuestionType = 'COMPREHENSION' | 'VOCABULARY' | 'INFERENCE' | 'PERSONAL_RESPONSE' | 'ANALYSIS';

export interface GenerateStoryOptions {
  prompt: string;
  level: EnglishLevel;
}
