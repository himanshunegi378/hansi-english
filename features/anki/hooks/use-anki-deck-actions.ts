"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createDeckRequest,
  deleteDeckRequest,
} from "../lib/anki-api-client";
import type { CreateDeckInput } from "../backend/types";

/**
 * Manages client-side deck create and delete actions.
 * @returns Action handlers plus their pending states.
 */
export function useAnkiDeckActions() {
  const router = useRouter();
  const [deletingDeckId, setDeletingDeckId] = useState<string | null>(null);
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);

  /**
   * Creates a new deck and refreshes the route data.
   * @param input Deck creation payload.
   * @returns Whether the request completed successfully.
   */
  async function createDeck(input: CreateDeckInput): Promise<boolean> {
    setIsCreatingDeck(true);

    try {
      await createDeckRequest(input);
      toast.success("Deck created.");
      startTransition(() => {
        router.refresh();
      });
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create deck.",
      );
      return false;
    } finally {
      setIsCreatingDeck(false);
    }
  }

  /**
   * Deletes a deck and refreshes route data.
   * @param deckId Deck id to delete.
   * @returns Whether the request completed successfully.
   */
  async function deleteDeck(deckId: string): Promise<boolean> {
    setDeletingDeckId(deckId);

    try {
      await deleteDeckRequest(deckId);
      toast.success("Deck deleted.");
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete deck.",
      );
      return false;
    } finally {
      setDeletingDeckId(null);
    }
  }

  return {
    createDeck,
    deleteDeck,
    deletingDeckId,
    isCreatingDeck,
  };
}
