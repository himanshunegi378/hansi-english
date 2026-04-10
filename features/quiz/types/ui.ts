export type QuizUiStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type QuizUiQuestionType = "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER";
export type QuizUiAttemptStatus = "IN_PROGRESS" | "SUBMITTED" | "AUTO_GRADED" | "MANUALLY_GRADED";

export interface QuizUiOption {
  id: string;
  text: string;
  order: number;
  isCorrect?: boolean;
}

export interface QuizUiQuestion {
  id: string;
  text: string;
  explanation: string;
  type: QuizUiQuestionType;
  order: number;
  points: number;
  isRequired: boolean;
  correctTextAnswer?: string;
  options: QuizUiOption[];
}

export interface QuizUiSection {
  id: string;
  title: string;
  description: string;
  order: number;
  questions: QuizUiQuestion[];
}

export interface QuizUiRecord {
  id: string;
  title: string;
  description: string;
  status: QuizUiStatus;
  timeLimitMin: number;
  passingScore: number;
  sectionCount: number;
  questionCount: number;
  createdAt: string;
  updatedAt: string;
  sections: QuizUiSection[];
}

export interface QuizUiAttemptAnswerReview {
  id: string;
  questionId: string;
  questionText: string;
  questionType: QuizUiQuestionType;
  learnerAnswer: string;
  selectedOptionIds: string[];
  correctAnswer: string;
  correctOptionIds: string[];
  explanation: string;
  isCorrect: boolean | null;
  awardedPoints: number | null;
  maxPoints: number;
  feedback: string;
  needsManualReview: boolean;
}

export interface QuizUiAttemptRecord {
  id: string;
  quizId: string;
  quizTitle: string;
  learnerName: string;
  learnerEmail: string;
  attemptNumber: number;
  status: QuizUiAttemptStatus;
  score: number | null;
  maxScore: number;
  passed: boolean | null;
  startedAt: string;
  submittedAt: string | null;
  completionRate: number;
  answers: QuizUiAttemptAnswerReview[];
}

export interface QuizUiAnalyticsRecord {
  quizId: string;
  totalAttempts: number;
  averageScore: number;
  passRate: number;
  completionRate: number;
}

