import type { CardDto, DeckDetail, DeckSummary, StudyCardDto } from "../backend/types";

export interface AnkiDeckListItem extends DeckSummary {
  createdAtLabel: string;
  href: string;
  studyHref: string;
}

export interface AnkiDeckCardViewModel extends CardDto {
  nextReviewLabel: string;
}

export interface AnkiDeckDetailViewModel
  extends Omit<DeckDetail, "cards" | "createdAt" | "updatedAt"> {
  cards: AnkiDeckCardViewModel[];
  createdAtLabel: string;
  dueCards: number;
  studyHref: string;
  totalCards: number;
  updatedAtLabel: string;
}

export interface AnkiStudySessionCard extends StudyCardDto {
  deckTitle: string;
}

export interface AnkiStudySessionState {
  activeCard: AnkiStudySessionCard | null;
  currentIndex: number;
  isAnswerVisible: boolean;
  phase: "active" | "complete" | "empty";
  progressValue: number;
  remainingCount: number;
  reviewedCount: number;
  totalCount: number;
}
