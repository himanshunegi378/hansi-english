export type ReviewGrade = 1 | 2 | 3 | 4;

export interface DeckSummary {
  id: string;
  name: string;
  description: string | null;
  totalCards: number;
  dueCards: number;
  createdAt: string;
}

export interface CardDto {
  id: string;
  deckId: string;
  front: string;
  back: string;
  interval: number;
  ease: number;
  nextReview: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DeckDetail {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  cards: CardDto[];
}

export interface StudyCardDto {
  id: string;
  front: string;
  back: string;
}

export interface StudyQueueResponse {
  data: StudyCardDto[];
  meta: {
    totalDue: number;
  };
}

export interface ReviewResult {
  id: string;
  newInterval: number;
  newEase: number;
  nextReview: string;
}

export interface CreateDeckInput {
  name: string;
  description?: string | null;
}

export interface CreateCardInput {
  front: string;
  back: string;
}

export interface UpdateCardInput {
  front: string;
  back: string;
}

export interface ReviewCardInput {
  grade: ReviewGrade;
}

export interface ApiSuccessResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
  };
}
