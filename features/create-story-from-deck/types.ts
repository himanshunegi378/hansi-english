import type { PersistedStory } from "@/features/story/types";

/**
 * Serialized error payload returned by the create-story action.
 */
export type CreateStoryFromDeckError = {
  message: string;
};

/**
 * Serialized server action result for creating a story from a deck.
 */
export type CreateStoryFromDeckResult =
  | {
      success: true;
      story: PersistedStory;
    }
  | {
      success: false;
      error: CreateStoryFromDeckError;
    };
