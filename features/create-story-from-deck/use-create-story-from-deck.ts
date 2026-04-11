"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { PersistedStory } from "@/features/story/types";
import { createStoryFromDeck } from "./create-story-from-deck";

/**
 * Manages story creation actions that start from an Anki deck.
 * @returns The deck-story creation handler plus its pending state.
 */
export function useCreateStoryFromDeck() {
  const createStoryMutation = useMutation({
    mutationFn: (deckId: string) => createStoryFromDeck(deckId),
  });

  /**
   * Creates a story from the provided deck.
   * @param deckId Source deck id.
   * @returns The saved story or `null` when creation fails.
   */
  async function createDeckStory(deckId: string): Promise<PersistedStory | null> {
    try {
      const story = await createStoryMutation.mutateAsync(deckId);
      toast.success("Story created.");
      return story;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create story.",
      );
      return null;
    }
  }

  return {
    createDeckStory,
    creatingStoryDeckId: createStoryMutation.isPending
      ? createStoryMutation.variables ?? null
      : null,
    isCreatingDeckStory: createStoryMutation.isPending,
  };
}
