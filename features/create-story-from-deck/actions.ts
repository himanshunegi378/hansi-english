'use server'

import { requireAnkiUserId } from "@/features/anki/backend/auth";
import { findDeckById } from "@/features/anki/backend/repository";
import {
  generateStoryContentAction,
  generateStoryQuestionsAction,
  getSavedStoryByIdAction,
  saveGeneratedStoryAction,
} from "@/features/story";
import { POINTS_PER_QUESTION } from "@/features/story/const";
import type { EnglishLevel, PersistedStory } from "@/features/story/types";
import prisma from "@/lib/prisma";
import { getOptionalUserId } from "@/features/story/actions/story-attempt-helpers";
import type { StoryListItem } from "@/features/story/types";
import type { CreateStoryFromDeckResult } from "./types";

const DEFAULT_STORY_LEVEL: EnglishLevel = "BEGINNER";
const MAX_PROMPT_CARDS = 12;

/**
 * Builds a story prompt from the selected deck and its cards.
 * @param deck The deck with ordered cards.
 * @returns A prompt compatible with the story generation flow.
 */
function buildDeckStoryPrompt(
  deck: {
    cards: Array<{ back: string; front: string }>;
    description: string | null;
    name: string;
  },
): string {
  const cardLines = deck.cards
    .slice(0, MAX_PROMPT_CARDS)
    .map(
      (card, index) =>
        `${index + 1}. Word or phrase: ${card.front}. Meaning or usage: ${card.back}.`,
    )
    .join("\n");

  const descriptionLine = deck.description
    ? `Deck description: ${deck.description}.`
    : "Deck description: none provided.";

  return [
    `Create a simple, coherent English story inspired by this vocabulary deck: ${deck.name}.`,
    descriptionLine,
    "Naturally include the following deck items in the story where possible:",
    cardLines,
  ].join("\n");
}

/**
 * Creates and saves a story generated from a user-owned deck.
 * @param deckId The source deck identifier.
 * @returns A serialized result containing either the persisted story or an error.
 */
export async function createStoryFromDeckAction(
  deckId: string,
): Promise<CreateStoryFromDeckResult> {
  try {
    const userId = await requireAnkiUserId();
    const deck = await findDeckById(deckId, userId);

    if (!deck) {
      return {
        success: false,
        error: {
          message: "Deck not found.",
        },
      };
    }

    if (deck.cards.length === 0) {
      return {
        success: false,
        error: {
          message: "Cannot create a story from an empty deck.",
        },
      };
    }

    const prompt = buildDeckStoryPrompt(deck);
    const story = await generateStoryContentAction({
      prompt,
      level: DEFAULT_STORY_LEVEL,
    });
    const questions = await generateStoryQuestionsAction(
      story.content,
      DEFAULT_STORY_LEVEL,
    );

    const savedStory = await saveGeneratedStoryAction(
      {
        prompt,
        title: story.title,
        content: story.content,
        level: DEFAULT_STORY_LEVEL,
        questions: questions.questions,
      },
      {
        userId,
      },
    );

    await prisma.deckStoryMapping.create({
      data: {
        deckId,
        storyId: savedStory.id,
      },
    });

    return {
      success: true,
      story: savedStory,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to create story.",
      },
    };
  }
}

/**
 * Resolves the saved story linked to a user-owned deck.
 * @param deckId The source deck identifier.
 * @returns The persisted story mapped to the deck, or `null` when none exists.
 */
export async function getStoryByDeckIdAction(
  deckId: string,
): Promise<PersistedStory | null> {
  const userId = await requireAnkiUserId();
  const deck = await findDeckById(deckId, userId);

  if (!deck) {
    throw new Error("Deck not found.");
  }

  const mapping = await prisma.deckStoryMapping.findFirst({
    where: {
      deckId,
      deck: {
        userId,
      },
    },
    select: {
      storyId: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!mapping) {
    return null;
  }

  return getSavedStoryByIdAction(mapping.storyId);
}

/**
 * Lists saved stories generated for a user-owned deck.
 * @param deckId The source deck identifier.
 * @returns Saved stories for the deck ordered from newest to oldest.
 */
export async function listStoriesByDeckIdAction(
  deckId: string,
): Promise<StoryListItem[]> {
  const [ownerUserId, viewerUserId] = await Promise.all([
    requireAnkiUserId(),
    getOptionalUserId(),
  ]);
  const deck = await findDeckById(deckId, ownerUserId);

  if (!deck) {
    throw new Error("Deck not found.");
  }

  const stories = await prisma.story.findMany({
    where: {
      deckStoryMapping: {
        deckId,
        deck: {
          userId: ownerUserId,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      content: true,
      level: true,
      createdAt: true,
      _count: {
        select: {
          questions: true,
        },
      },
      ...(viewerUserId
        ? {
          progress: {
            where: {
              userId: viewerUserId,
            },
            select: {
              earnedPoints: true,
              totalPoints: true,
              completedAt: true,
            },
            take: 1,
          },
        }
        : {}),
    },
  });

  return stories.map((story) => ({
    id: story.id,
    title: story.title,
    content: story.content,
    level: story.level,
    createdAt: story.createdAt.toISOString(),
    questionCount: story._count.questions,
    earnedPoints: story.progress?.[0]?.earnedPoints ?? 0,
    totalPoints:
      story.progress?.[0]?.totalPoints ?? story._count.questions * POINTS_PER_QUESTION,
    isCompleted: Boolean(story.progress?.[0]?.completedAt),
  }));
}
