"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createCardRequest,
  deleteCardRequest,
  updateCardRequest,
} from "../lib/anki-api-client";
import type { CreateCardInput } from "../backend/types";

/**
 * Manages client-side card create, update, and delete actions.
 * @returns Action handlers plus pending states.
 */
export function useAnkiCardActions() {
  const router = useRouter();
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);
  const [isSavingCard, setIsSavingCard] = useState(false);

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
    setIsSavingCard(true);

    try {
      await createCardRequest(deckId, input);
      toast.success("Card added.");
      startTransition(() => {
        router.refresh();
      });
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add card.");
      return false;
    } finally {
      setIsSavingCard(false);
    }
  }

  /**
   * Updates an existing card.
   * @param cardId Card id to update.
   * @param input Card values.
   * @returns Whether the request completed successfully.
   */
  async function updateCard(
    cardId: string,
    input: CreateCardInput,
  ): Promise<boolean> {
    setIsSavingCard(true);

    try {
      await updateCardRequest(cardId, input);
      toast.success("Card updated.");
      startTransition(() => {
        router.refresh();
      });
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update card.",
      );
      return false;
    } finally {
      setIsSavingCard(false);
    }
  }

  /**
   * Deletes a card.
   * @param cardId Card id to delete.
   * @returns Whether the request completed successfully.
   */
  async function deleteCard(cardId: string): Promise<boolean> {
    setDeletingCardId(cardId);

    try {
      await deleteCardRequest(cardId);
      toast.success("Card deleted.");
      startTransition(() => {
        router.refresh();
      });
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete card.",
      );
      return false;
    } finally {
      setDeletingCardId(null);
    }
  }

  return {
    createCard,
    deleteCard,
    deletingCardId,
    isSavingCard,
    updateCard,
  };
}
