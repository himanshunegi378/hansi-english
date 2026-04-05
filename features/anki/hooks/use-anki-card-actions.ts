"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createCardRequest,
  deleteCardRequest,
  updateCardRequest,
} from "../lib/anki-api-client";
import type { CreateCardInput } from "../backend/types";
import { ankiQueryKeys } from "../query-key";

interface CreateCardVariables {
  deckId: string;
  input: CreateCardInput;
}

interface UpdateCardVariables extends CreateCardVariables {
  cardId: string;
}

interface DeleteCardVariables {
  cardId: string;
  deckId: string;
}

/**
 * Manages client-side card create, update, and delete actions.
 * @returns Action handlers plus pending states.
 */
export function useAnkiCardActions() {
  const queryClient = useQueryClient();
  const createCardMutation = useMutation({
    mutationFn: ({ deckId, input }: CreateCardVariables) =>
      createCardRequest(deckId, input),
  });
  const updateCardMutation = useMutation({
    mutationFn: ({ cardId, input }: UpdateCardVariables) =>
      updateCardRequest(cardId, input),
  });
  const deleteCardMutation = useMutation({
    mutationFn: ({ cardId }: DeleteCardVariables) => deleteCardRequest(cardId),
  });

  /**
   * Refreshes every query affected by a card change.
   * @param deckId Parent deck id.
   */
  async function invalidateDeckQueries(deckId: string) {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ankiQueryKeys.decks.detail(deckId),
      }),
      queryClient.invalidateQueries({
        queryKey: ankiQueryKeys.study.queue(deckId),
      }),
      queryClient.invalidateQueries({
        queryKey: ankiQueryKeys.decks.list(),
      }),
    ]);
  }

  /**
   * Creates a card in the provided deck.
   * @param deckId Parent deck id.
   * @param input Card values.
   * @returns Whether the request completed successfully.
   */
  async function createCard(
    deckId: string,
    input: CreateCardInput,
  ): Promise<boolean> {
    try {
      await createCardMutation.mutateAsync({ deckId, input });
      await invalidateDeckQueries(deckId);
      toast.success("Card added.");
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add card.");
      return false;
    }
  }

  /**
   * Updates an existing card.
   * @param cardId Card id to update.
   * @param deckId Parent deck id.
   * @param input Card values.
   * @returns Whether the request completed successfully.
   */
  async function updateCard(
    cardId: string,
    deckId: string,
    input: CreateCardInput,
  ): Promise<boolean> {
    try {
      await updateCardMutation.mutateAsync({ cardId, deckId, input });
      await invalidateDeckQueries(deckId);
      toast.success("Card updated.");
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update card.",
      );
      return false;
    }
  }

  /**
   * Deletes a card.
   * @param cardId Card id to delete.
   * @param deckId Parent deck id.
   * @returns Whether the request completed successfully.
   */
  async function deleteCard(cardId: string, deckId: string): Promise<boolean> {
    try {
      await deleteCardMutation.mutateAsync({ cardId, deckId });
      await invalidateDeckQueries(deckId);
      toast.success("Card deleted.");
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete card.",
      );
      return false;
    }
  }

  return {
    createCard,
    deleteCard,
    deletingCardId: deleteCardMutation.isPending
      ? deleteCardMutation.variables?.cardId ?? null
      : null,
    isSavingCard: createCardMutation.isPending || updateCardMutation.isPending,
    updateCard,
  };
}
