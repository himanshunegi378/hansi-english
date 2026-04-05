"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createDeckRequest,
  deleteDeckRequest,
} from "../lib/anki-api-client";
import type { CreateDeckInput } from "../backend/types";
import { ankiQueryKeys } from "../query-key";

/**
 * Manages client-side deck create and delete actions.
 * @returns Action handlers plus their pending states.
 */
export function useAnkiDeckActions() {
  const queryClient = useQueryClient();
  const createDeckMutation = useMutation({
    mutationFn: createDeckRequest,
  });
  const deleteDeckMutation = useMutation({
    mutationFn: deleteDeckRequest,
  });

  /**
   * Creates a new deck and refreshes the deck list query.
   * @param input Deck creation payload.
   * @returns Whether the request completed successfully.
   */
  async function createDeck(input: CreateDeckInput): Promise<boolean> {
    try {
      await createDeckMutation.mutateAsync(input);
      await queryClient.invalidateQueries({
        queryKey: ankiQueryKeys.decks.list(),
      });
      toast.success("Deck created.");
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create deck.",
      );
      return false;
    }
  }

  /**
   * Deletes a deck and clears related cached data.
   * @param deckId Deck id to delete.
   * @returns Whether the request completed successfully.
   */
  async function deleteDeck(deckId: string): Promise<boolean> {
    try {
      await deleteDeckMutation.mutateAsync(deckId);
      queryClient.removeQueries({
        queryKey: ankiQueryKeys.decks.detail(deckId),
      });
      queryClient.removeQueries({
        queryKey: ankiQueryKeys.study.queue(deckId),
      });
      await queryClient.invalidateQueries({
        queryKey: ankiQueryKeys.decks.list(),
      });
      toast.success("Deck deleted.");
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete deck.",
      );
      return false;
    }
  }

  return {
    createDeck,
    deleteDeck,
    deletingDeckId: deleteDeckMutation.isPending
      ? deleteDeckMutation.variables ?? null
      : null,
    isCreatingDeck: createDeckMutation.isPending,
  };
}
