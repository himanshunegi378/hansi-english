"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { reviewCardRequest } from "../lib/anki-api-client";
import type { ReviewGrade } from "../backend/types";
import { ankiQueryKeys } from "../query-key";
import type { AnkiStudySessionCard, AnkiStudySessionState } from "../types/ui";

/**
 * Manages answer reveal, review submission, and progress state for one study session.
 * @param deckId Active deck id.
 * @param initialCards Due cards loaded for the session.
 * @returns The session state and interaction handlers.
 */
export function useAnkiStudySession(
  deckId: string,
  initialCards: AnkiStudySessionCard[],
) {
  const queryClient = useQueryClient();
  const [completedCardIds, setCompletedCardIds] = useState<string[]>([]);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const reviewMutation = useMutation({
    mutationFn: ({
      cardId,
      grade,
    }: {
      cardId: string;
      grade: ReviewGrade;
    }) => reviewCardRequest(cardId, { grade }),
  });

  const cards = initialCards.filter(
    (card) => !completedCardIds.includes(card.id),
  );
  const totalCount = completedCardIds.length + cards.length;
  const reviewedCount = completedCardIds.length;
  const remainingCount = cards.length;
  const activeCard = cards[0] ?? null;
  const phase: AnkiStudySessionState["phase"] =
    totalCount === 0 ? "empty" : activeCard ? "active" : "complete";

  const state: AnkiStudySessionState = {
    activeCard,
    currentIndex: reviewedCount,
    isAnswerVisible,
    phase,
    progressValue:
      totalCount === 0 ? 0 : Math.round((reviewedCount / totalCount) * 100),
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

    void (async () => {
      try {
        await reviewMutation.mutateAsync({ cardId: activeCard.id, grade });
        setCompletedCardIds((currentIds) => [...currentIds, activeCard.id]);
        setIsAnswerVisible(false);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ankiQueryKeys.study.queue(deckId),
          }),
          queryClient.invalidateQueries({
            queryKey: ankiQueryKeys.decks.detail(deckId),
          }),
          queryClient.invalidateQueries({
            queryKey: ankiQueryKeys.decks.list(),
          }),
        ]);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to save your review.",
        );
      }
    })();
  }

  return {
    hideAnswer,
    isPending: reviewMutation.isPending,
    revealAnswer,
    state,
    submitGrade,
  };
}
