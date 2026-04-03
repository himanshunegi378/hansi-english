"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import {
  generateStoryContentAction,
  generateStoryQuestionsAction,
  saveGeneratedStoryAction,
} from "../actions/generate-story";
import { type GenerateStoryInput } from "../schemas";
import { type EnglishLevel, type GeneratedQuestion, type GeneratedStoryDraft } from "../types";

interface UseGenerateStoryOptions {
  level: EnglishLevel;
  setQuestions: Dispatch<SetStateAction<GeneratedQuestion[] | null>>;
  setSavedStoryId: Dispatch<SetStateAction<string | null>>;
  setStory: Dispatch<SetStateAction<GeneratedStoryDraft | null>>;
}

interface UseGenerateQuestionsOptions {
  story: GeneratedStoryDraft | null;
  setQuestions: Dispatch<SetStateAction<GeneratedQuestion[] | null>>;
}

interface UseSaveStoryOptions {
  questions: GeneratedQuestion[] | null;
  savedStoryId: string | null;
  setSavedStoryId: Dispatch<SetStateAction<string | null>>;
  story: GeneratedStoryDraft | null;
}

/**
 * Handles story draft generation and related admin UI state resets.
 * @param options Hook configuration for story generation.
 * @returns The generation handler and its pending state.
 */
export function useGenerateStory({
  level,
  setQuestions,
  setSavedStoryId,
  setStory,
}: UseGenerateStoryOptions) {
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);

  /**
   * Generates a story draft from the user's prompt and selected level.
   * @param data The validated form input from the prompt form.
   */
  async function generateStory(data: GenerateStoryInput) {
    setIsGeneratingStory(true);
    setStory(null);
    setQuestions(null);
    setSavedStoryId(null);

    try {
      const result = await generateStoryContentAction({ ...data, level });
      setStory({
        prompt: data.prompt,
        title: result.title,
        content: result.content,
        level,
      });
      toast.success("Story generated successfully!");
    } catch (error) {
      toast.error("Failed to generate story. Please try again.");
      console.error(error);
    } finally {
      setIsGeneratingStory(false);
    }
  }

  return {
    generateStory,
    isGeneratingStory,
  };
}

/**
 * Handles question generation for the current story draft.
 * @param options Hook configuration for question generation.
 * @returns The question generation handler and its pending state.
 */
export function useGenerateQuestions({
  story,
  setQuestions,
}: UseGenerateQuestionsOptions) {
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  /**
   * Generates quiz questions for the current draft story.
   */
  async function generateQuestions() {
    if (!story) return;

    setIsGeneratingQuestions(true);
    try {
      const result = await generateStoryQuestionsAction(story.content, story.level);
      setQuestions(
        result.questions.map((question) => ({
          ...question,
          id: crypto.randomUUID(),
        }))
      );
      toast.success("Questions generated successfully!");
    } catch (error) {
      toast.error("Failed to generate questions. Please try again.");
      console.error(error);
    } finally {
      setIsGeneratingQuestions(false);
    }
  }

  return {
    generateQuestions,
    isGeneratingQuestions,
  };
}

/**
 * Persists the generated story package to the shared library.
 * @param options Hook configuration for story persistence.
 * @returns The save handler and its pending state.
 */
export function useSaveStory({
  questions,
  savedStoryId,
  setSavedStoryId,
  story,
}: UseSaveStoryOptions) {
  const [isSavingStory, setIsSavingStory] = useState(false);

  /**
   * Saves the current story and questions when a complete draft is available.
   */
  async function saveStory() {
    if (!story || !questions || isSavingStory || savedStoryId) return;

    setIsSavingStory(true);
    try {
      const savedStory = await saveGeneratedStoryAction({
        prompt: story.prompt,
        title: story.title,
        content: story.content,
        level: story.level,
        questions: questions.map(({ correctAnswer, options, text, type }) => ({
          text,
          type,
          options,
          correctAnswer,
        })),
      });

      setSavedStoryId(savedStory.id);
      toast.success("Story saved to the library!");
    } catch (error) {
      toast.error("Failed to save story. Please try again.");
      console.error(error);
    } finally {
      setIsSavingStory(false);
    }
  }

  return {
    isSavingStory,
    saveStory,
  };
}
