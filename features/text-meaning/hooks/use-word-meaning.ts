"use client";

import { useEffect, useState } from "react";
import { getWordMeaningAction } from "../actions/get-word-meaning";
import type { MeaningResult, SelectedText } from "../types";

interface UseWordMeaningResult {
  errorMessage: string | null;
  isLoading: boolean;
  meaning: MeaningResult | null;
}

/**
 * Loads the AI-generated meaning for the provided word or phrase.
 * @param selectedText The selected text and surrounding context to define.
 * @returns Loading, error, and meaning state for the selection.
 */
export function useWordMeaning(selectedText: SelectedText | null): UseWordMeaningResult {
  const [meaning, setMeaning] = useState<MeaningResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedText) {
      setMeaning(null);
      setErrorMessage(null);
      setIsLoading(false);
      return;
    }

    let isActive = true;

    /**
     * Resolves the selection with the server-side AI meaning action.
     */
    const loadMeaning = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      setMeaning(null);

      try {
        const normalizedWord = selectedText.text
          .replace(/[^\p{L}\p{N}\s'-]/gu, "")
          .trim()
          .toLowerCase();

        if (!normalizedWord) {
          throw new Error("Select a word or short phrase to see its meaning.");
        }

        const result = await getWordMeaningAction({
          word: normalizedWord,
          contextSentence: selectedText.contextSentence,
        });

        if (!result.meanings.length) {
          throw new Error("Meaning not found for this selection.");
        }

        if (isActive) {
          setMeaning(result);
        }
      } catch (error) {
        if (isActive) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Something went wrong while loading the meaning.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadMeaning();

    return () => {
      isActive = false;
    };
  }, [selectedText]);

  return {
    errorMessage,
    isLoading,
    meaning,
  };
}
