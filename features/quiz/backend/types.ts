import type {
  QuizAttemptStatus,
  QuizQuestionType,
  QuizStatus,
} from "@/generated/prisma/client";

export interface PaginationDto {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface QuizListFilters {
  page: number;
  pageSize: number;
  status?: QuizStatus;
}

export interface QuizSummaryDto {
  id: string;
  title: string;
  description: string | null;
  status: QuizStatus;
  timeLimitMin: number | null;
  passingScore: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface QuizQuestionOptionDto {
  id: string;
  text: string;
  order: number;
  isCorrect?: boolean;
}

export interface QuizQuestionDto {
  id: string;
  sectionId: string;
  text: string;
  explanation: string | null;
  type: QuizQuestionType;
  order: number;
  points: number;
  isRequired: boolean;
  correctTextAnswer?: string | null;
  options: QuizQuestionOptionDto[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizSectionDto {
  id: string;
  quizId: string;
  title: string;
  description: string | null;
  order: number;
  questions?: QuizQuestionDto[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizDetailDto {
  id: string;
  title: string;
  description: string | null;
  status: QuizStatus;
  timeLimitMin: number | null;
  passingScore: number | null;
  sections: QuizSectionDto[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizAttemptSummaryDto {
  id: string;
  attemptNumber: number;
  status: QuizAttemptStatus;
  score: number | null;
  maxScore: number | null;
  passed: boolean | null;
  startedAt: string;
  submittedAt: string | null;
}

export interface QuizAttemptDto extends QuizAttemptSummaryDto {
  quizId: string;
  userId: string;
}

export interface AttemptAnswerOptionDto {
  optionId: string;
}

export interface AttemptAnswerDto {
  id: string;
  attemptId: string;
  questionId: string;
  textAnswer: string | null;
  isCorrect: boolean | null;
  awardedPoints: number | null;
  feedback?: string | null;
  gradedAt?: string | null;
  selectedOptions: AttemptAnswerOptionDto[];
  updatedAt: string;
}

export interface AttemptDetailDto extends QuizAttemptDto {
  answers: AttemptAnswerDto[];
}

export interface AttemptSummaryStatsDto {
  totalQuestions: number;
  answeredQuestions: number;
  correctQuestions: number;
  incorrectQuestions: number;
}

export interface SubmittedAttemptDto extends QuizAttemptDto {
  summary: AttemptSummaryStatsDto;
}

export interface AttemptResultAnswerDto {
  questionId: string;
  questionText: string;
  isCorrect: boolean | null;
  awardedPoints: number | null;
  selectedOptionIds: string[];
  correctOptionIds: string[];
  explanation: string | null;
}

export interface AttemptResultDto {
  attemptId: string;
  quizId: string;
  score: number | null;
  maxScore: number | null;
  passed: boolean | null;
  status: QuizAttemptStatus;
  submittedAt: string | null;
  answers: AttemptResultAnswerDto[];
}

export interface QuizListResponseDto {
  items: QuizSummaryDto[];
  pagination: PaginationDto;
}

export interface AttemptListResponseDto {
  items: QuizAttemptSummaryDto[];
}

export interface CreateQuizInput {
  title: string;
  description?: string | null;
  status?: QuizStatus;
  timeLimitMin?: number | null;
  passingScore?: number | null;
}

export interface UpdateQuizInput {
  title?: string;
  description?: string | null;
  status?: QuizStatus;
  timeLimitMin?: number | null;
  passingScore?: number | null;
}

export interface CreateSectionInput {
  title: string;
  description?: string | null;
  order: number;
}

export interface CreateQuestionOptionInput {
  text: string;
  order: number;
  isCorrect: boolean;
}

export interface CreateQuestionInput {
  text: string;
  explanation?: string | null;
  type: QuizQuestionType;
  order: number;
  points?: number;
  isRequired?: boolean;
  options?: CreateQuestionOptionInput[];
  correctTextAnswer?: string | null;
}

export interface UpdateQuestionInput {
  text?: string;
  explanation?: string | null;
  order?: number;
  points?: number;
  isRequired?: boolean;
  correctTextAnswer?: string | null;
}

export interface StartAttemptInput {
  resumeAttemptId?: string | null;
}

export interface SaveAnswerInput {
  selectedOptionIds?: string[];
  textAnswer?: string | null;
}

export interface SubmitAttemptInput {
  forceSubmit?: boolean;
}

export interface ManualGradeInput {
  isCorrect: boolean;
  awardedPoints: number;
  feedback?: string | null;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
