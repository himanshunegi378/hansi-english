"use client";

import { useEffect, useState } from "react";
import type {
  DictionaryApiResponse,
  DictionaryDefinition,
  DictionaryEntry,
  DictionaryLicense,
  DictionaryMeaning,
  DictionaryPhonetic,
  MeaningResult,
} from "../types";

interface UseWordMeaningResult {
  errorMessage: string | null;
  isLoading: boolean;
  meaning: MeaningResult | null;
}

/**
 * Loads the first dictionary definition for the provided word or phrase.
 * @param text The selected text to define.
 * @returns Loading, error, and meaning state for the selection.
 */
export function useWordMeaning(text: string | null): UseWordMeaningResult {
  const [meaning, setMeaning] = useState<MeaningResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!text) {
      setMeaning(null);
      setErrorMessage(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    /**
     * Resolves the selection against the public dictionary API.
     */
    const loadMeaning = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      setMeaning(null);

      try {
        const normalizedWord = text
          .replace(/[^\p{L}\p{N}\s'-]/gu, "")
          .trim()
          .toLowerCase();

        if (!normalizedWord) {
          throw new Error("Select a word or short phrase to see its meaning.");
        }

        const response = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(normalizedWord)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Meaning not found for this selection.");
        }

        const data = (await response.json()) as unknown;
        const firstEntry = parseDictionaryResponse(data)[0] ?? null;

        if (!firstEntry || firstEntry.meanings.length === 0) {
          throw new Error("Meaning not found for this selection.");
        }

        setMeaning(firstEntry);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Something went wrong while loading the meaning.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadMeaning();

    return () => controller.abort();
  }, [text]);

  return {
    errorMessage,
    isLoading,
    meaning,
  };
}

/**
 * Parses the unknown API payload into a typed dictionary response.
 * @param data The raw JSON payload returned by the dictionary API.
 * @returns A normalized list of dictionary entries.
 */
function parseDictionaryResponse(data: unknown): DictionaryApiResponse {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((entry) => parseDictionaryEntry(entry))
    .filter((entry): entry is DictionaryEntry => entry !== null);
}

/**
 * Parses a raw value into a single dictionary entry.
 * @param value The raw entry candidate.
 * @returns A normalized dictionary entry when valid.
 */
function parseDictionaryEntry(value: unknown): DictionaryEntry | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const word = readString(value, "word");
  const meanings = readArray(value, "meanings")
    .map((meaning) => parseMeaning(meaning))
    .filter((meaning): meaning is DictionaryMeaning => meaning !== null);

  if (!word || meanings.length === 0) {
    return null;
  }

  return {
    word,
    phonetic: readString(value, "phonetic") ?? undefined,
    phonetics: readArray(value, "phonetics")
      .map((phonetic) => parsePhonetic(phonetic))
      .filter((phonetic): phonetic is DictionaryPhonetic => phonetic !== null),
    meanings,
    license: parseLicense(readObject(value, "license")) ?? undefined,
    sourceUrls: readStringArray(value, "sourceUrls"),
  };
}

/**
 * Parses pronunciation metadata from a raw value.
 * @param value The raw phonetic candidate.
 * @returns A normalized phonetic entry when valid.
 */
function parsePhonetic(value: unknown): DictionaryPhonetic | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const text = readString(value, "text") ?? undefined;
  const audio = readString(value, "audio") ?? undefined;
  const sourceUrl = readString(value, "sourceUrl") ?? undefined;
  const license = parseLicense(readObject(value, "license")) ?? undefined;

  if (!text && !audio && !sourceUrl && !license) {
    return null;
  }

  return {
    text,
    audio,
    sourceUrl,
    license,
  };
}

/**
 * Parses a meaning group from a raw value.
 * @param value The raw meaning candidate.
 * @returns A normalized meaning group when valid.
 */
function parseMeaning(value: unknown): DictionaryMeaning | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const partOfSpeech = readString(value, "partOfSpeech");
  const definitions = readArray(value, "definitions")
    .map((definition) => parseDefinition(definition))
    .filter((definition): definition is DictionaryDefinition => definition !== null);

  if (!partOfSpeech || definitions.length === 0) {
    return null;
  }

  return {
    partOfSpeech,
    definitions,
    synonyms: readStringArray(value, "synonyms"),
    antonyms: readStringArray(value, "antonyms"),
  };
}

/**
 * Parses a definition from a raw value.
 * @param value The raw definition candidate.
 * @returns A normalized definition when valid.
 */
function parseDefinition(value: unknown): DictionaryDefinition | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const definition = readString(value, "definition");

  if (!definition) {
    return null;
  }

  return {
    definition,
    synonyms: readStringArray(value, "synonyms"),
    antonyms: readStringArray(value, "antonyms"),
    example: readString(value, "example") ?? undefined,
  };
}

/**
 * Parses license metadata from a raw value.
 * @param value The raw license candidate.
 * @returns A normalized license when valid.
 */
function parseLicense(value: Record<string, unknown> | null): DictionaryLicense | null {
  if (!value) {
    return null;
  }

  const name = readString(value, "name");
  const url = readString(value, "url");

  if (!name || !url) {
    return null;
  }

  return { name, url };
}

/**
 * Safely reads an object property as a string.
 * @param value The source object.
 * @param key The property to read.
 * @returns The string value when present.
 */
function readString(value: object, key: string): string | null {
  if (!(key in value)) {
    return null;
  }

  const property = (value as Record<string, unknown>)[key];
  return typeof property === "string" ? property : null;
}

/**
 * Safely reads an object property as an array.
 * @param value The source object.
 * @param key The property to read.
 * @returns The array value when present.
 */
function readArray(value: object, key: string): unknown[] {
  if (!(key in value)) {
    return [];
  }

  const property = (value as Record<string, unknown>)[key];
  return Array.isArray(property) ? property : [];
}

/**
 * Safely reads an object property as a string array.
 * @param value The source object.
 * @param key The property to read.
 * @returns A filtered array of strings.
 */
function readStringArray(value: object, key: string): string[] {
  return readArray(value, key).filter((item): item is string => typeof item === "string");
}

/**
 * Safely reads an object property as another object.
 * @param value The source object.
 * @param key The property to read.
 * @returns The nested object when present.
 */
function readObject(value: object, key: string): Record<string, unknown> | null {
  if (!(key in value)) {
    return null;
  }

  const property = (value as Record<string, unknown>)[key];
  return property && typeof property === "object" && !Array.isArray(property)
    ? (property as Record<string, unknown>)
    : null;
}
