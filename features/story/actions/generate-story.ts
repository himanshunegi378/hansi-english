"use server";

import { generateText } from "ai";
import { defaultModel } from "@/lib/ai";
import { generateStorySchema, type StoryOnlyResponse, questionsOnlySchema, type QuestionsOnlyResponse } from "../schemas";
import { getStorySystemPrompt, getQuestionSystemPrompt } from "../prompts/story-prompts";
import { type EnglishLevel } from "../types";

/**
 * Generates a structured story based on a user prompt and level.
 * Uses AI SDK 6 with Output.object for structured JSON generation.
 * @param input The raw input containing prompt and level.
 * @returns The story title and content.
 */
export async function generateStoryContentAction(input: unknown): Promise<StoryOnlyResponse> {
  const result = generateStorySchema.safeParse(input);
  if (!result.success) {
    throw new Error("Invalid input");
  }

  const { prompt, level } = result.data;

  try {
    const { text } = await generateText({
      model: defaultModel,
      system: getStorySystemPrompt(level),
      prompt: `Provide a story about: ${prompt}`,
      maxOutputTokens: 3000,
      temperature: 0.7,
    });

    const titleMatch = text.match(/<title>(.*?)<\/title>/is);
    const contentMatch = text.match(/<content>(.*?)<\/content>/is);

    if (!titleMatch || !contentMatch) {
      console.error("AI Response was missing expected tags:", text);
      throw new Error("Failed to parse story from AI response. Please try again.");
    }

    return {
      title: titleMatch[1].trim(),
      content: contentMatch[1].trim(),
    };
  } catch (error) {
    console.error("Failed to generate story content:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to generate story. Please try again.");
  }
}

/**
 * Generates comprehension questions for a given story.
 * @param storyContent The story text to base questions on.
 * @param level The target English level for the questions.
 * @returns A list of generated questions and their metadata.
 */
export async function generateStoryQuestionsAction(storyContent: string, level: EnglishLevel): Promise<QuestionsOnlyResponse> {
  try {
    const { text } = await generateText({
      model: defaultModel,
      system: getQuestionSystemPrompt(level, storyContent),
      prompt: `Generate comprehension questions for the story.`,
      maxOutputTokens: 2000,
      temperature: 0.5,
    });

    const questionsMatch = text.match(/<questions>(.*?)<\/questions>/is);

    if (!questionsMatch) {
      console.error("AI Response was missing expected questions tags:", text);
      throw new Error("Failed to parse questions from AI response.");
    }

    try {
      const questions = JSON.parse(questionsMatch[1].trim());
      // Validate the parsed structure
      return questionsOnlySchema.parse({ questions });
    } catch (parseError) {
      console.error("Failed to parse JSON from questions tag:", questionsMatch[1], parseError);
      throw new Error("Invalid question format received from AI.");
    }
  } catch (error) {
    console.error("Failed to generate questions:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to generate questions. Please try again.");
  }
}
