"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { reviewCardRequest } from "../lib/anki-api-client";
import type { ReviewGrade } from "../backend/types";
import type { AnkiStudySessionCard, AnkiStudySessionState } from "../types/ui";

/**
 * Manages answer reveal, review submission, and progress state for one study session.
 * @param initialCards Due cards loaded for the session.
 * @returns The session state and interaction handlers.
 */
export function useAnkiStudySession(initialCards: AnkiStudySessionCard[]) {
  const [cards] = useState(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [isPending, startTransition] = useTransition();

  const totalCount = cards.length;
  const reviewedCount = Math.min(currentIndex, totalCount);
  const remainingCount = Math.max(totalCount - reviewedCount, 0);
  const activeCard = currentIndex < totalCount ? cards[currentIndex] : null;
  const phase: AnkiStudySessionState["phase"] =
    totalCount === 0 ? "empty" : activeCard ? "active" : "complete";

  const state: AnkiStudySessionState = {
    activeCard,
    currentIndex,
    isAnswerVisible,
    phase,
    progressValue: totalCount === 0 ? 0 : Math.round((reviewedCount / totalCount) * 100),
    remainingCount,
    reviewedCount,
    totalCount,
  };

  /**
   * Reveals the current card answer.
   */
  function revealAnswer() {
    setIsAnswerVisible(true);
  }

  /**
   * Hides the current answer so the learner can refocus on the prompt.
   */
  function hideAnswer() {
    setIsAnswerVisible(false);
  }

  /**
   * Submits a grade for the current card and advances the session.
   * @param grade Learner grade from `Again` to `Easy`.
   */
  function submitGrade(grade: ReviewGrade) {
    if (!activeCard) {
      return;
    }

    startTransition(async () => {
      try {
        await reviewCardRequest(activeCard.id, { grade });
        setIsAnswerVisible(false);
        setCurrentIndex((index) => index + 1);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to save your review.",
        );
      }
    });
  }

  return {
    hideAnswer,
    isPending,
    revealAnswer,
    state,
    submitGrade,
  };
}
