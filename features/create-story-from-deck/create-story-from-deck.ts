'use server'

import { requireAnkiUserId } from "@/features/anki/backend/auth";
import { findDeckById } from "@/features/anki/backend/repository";
import {
    generateStoryContentAction,
    generateStoryQuestionsAction,
    saveGeneratedStoryAction,
} from "@/features/story";
import type { EnglishLevel, PersistedStory } from "@/features/story/types";
import prisma from "@/lib/prisma";

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
 * @returns The persisted story created from the deck content.
 */
export async function createStoryFromDeck(deckId: string): Promise<PersistedStory> {
    const userId = await requireAnkiUserId();
    const deck = await findDeckById(deckId, userId);

    if (!deck) {
        throw new Error("Deck not found.");
    }

    if (deck.cards.length === 0) {
        throw new Error("Cannot create a story from an empty deck.");
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

    const savedStory = await saveGeneratedStoryAction({
        prompt,
        title: story.title,
        content: story.content,
        level: DEFAULT_STORY_LEVEL,
        questions: questions.questions,
    }, {
        userId,
    });

    await prisma.deckStoryMapping.create({
        data: {
            deckId,
            storyId: savedStory.id,
        },
    });

    return savedStory;
}
