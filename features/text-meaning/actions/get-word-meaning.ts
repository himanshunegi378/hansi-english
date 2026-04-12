"use server";

import { generateText } from "ai";
import type { Prisma } from "@/generated/prisma/client";
import { defaultModel } from "@/lib/ai";
import prisma from "@/lib/prisma";
import type {
  CachedMeaningResult,
  GetWordMeaningResponse,
  MeaningContextResult,
  MeaningPhonetic,
} from "../types";
import { z } from "zod";

const getWordMeaningSchema = z.object({
  contextSentence: z.string().trim().min(1).max(500).optional(),
  word: z.string().trim().min(1).max(120),
});

const meaningPhoneticSchema = z.object({
  audio: z.string().min(1).optional(),
  text: z.string().min(1),
});

const meaningGroupSchema = z.object({
  partOfSpeech: z.string().min(1),
  definitions: z
    .array(
      z.object({
        definition: z.string().min(1),
        hindiDefinition: z.string().min(1).optional(),
        example: z.string().min(1).optional(),
      }),
    )
    .min(1)
    .max(3),
  synonyms: z.array(z.string().min(1)).max(5).default([]),
  antonyms: z.array(z.string().min(1)).max(5).default([]),
});

const cachedMeaningSchema = z.object({
  word: z.string().min(1),
  phonetic: z.string().min(1).optional(),
  phonetics: z.array(meaningPhoneticSchema).max(5).default([]),
  hindiTranslation: z.string().min(1).optional(),
  meanings: z.array(meaningGroupSchema).min(1).max(3),
});

const meaningContextSchema = z.object({
  hindiHowItFitsInContext: z.string().min(1).optional(),
});

/**
 * Generates a structured English and Hindi meaning for a single word or short phrase.
 * Stable dictionary data is cached, while the Hindi context explanation is generated per request.
 * @param input The raw word selection to define.
 * @returns The validated meaning payload for the tooltip UI.
 */
export async function getWordMeaningAction(input: unknown): Promise<GetWordMeaningResponse> {
  const result = getWordMeaningSchema.safeParse(input);
  if (!result.success) {
    throw new Error(result.error.issues[0]?.message ?? "Invalid word selection.");
  }

  const { contextSentence, word } = result.data;
  const lookupKey = createLookupKey(word);

  try {
    const cachedMeaningPromise = getCachedMeaning(lookupKey);
    const phoneticsPromise = getDictionaryPronunciations(word);

    const [cachedMeaning, phonetics] = await Promise.all([
      cachedMeaningPromise,
      phoneticsPromise,
    ]);

    const stableMeaning =
      cachedMeaning ?? (await generateAndCacheStableMeaning({ lookupKey, phonetics, word }));

    const contextMeaning = contextSentence
      ? await generateContextMeaning({
          contextSentence,
          meanings: stableMeaning.meanings,
          word: stableMeaning.word,
        })
      : {};

    return {
      ...stableMeaning,
      ...contextMeaning,
      phonetics: mergePhonetics(stableMeaning.phonetics, phonetics),
    };
  } catch (error) {
    console.error("Failed to generate word meaning:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to generate word meaning. Please try again.",
    );
  }
}

interface GenerateStableMeaningOptions {
  lookupKey: string;
  phonetics: MeaningPhonetic[];
  word: string;
}

/**
 * Generates the cacheable word meaning and persists it for future lookups.
 * @param options The normalized lookup key, selected word, and dictionary phonetics.
 * @returns The validated stable meaning payload.
 */
async function generateAndCacheStableMeaning({
  lookupKey,
  phonetics,
  word,
}: GenerateStableMeaningOptions): Promise<CachedMeaningResult> {
  const aiResult = await generateText({
    model: defaultModel,
    system: [
      "You are a precise dictionary assistant for English learners.",
      "Return only valid JSON inside <result></result> tags.",
      "The response must include the English word, optional IPA phonetic, optional Hindi translation, and 1 to 3 meaning groups.",
      "Each meaning group must include partOfSpeech, up to 3 short learner-friendly definitions, a short Hindi definition for each definition, and concise synonyms/antonyms.",
      "Do not include sentence-specific usage notes.",
      "Do not include markdown, explanations, or extra text outside the tags.",
    ].join(" "),
    prompt: [
      `Word: ${word}`,
      "Respond in this JSON shape:",
      '{"word":"...","phonetic":"...","hindiTranslation":"...","meanings":[{"partOfSpeech":"...","definitions":[{"definition":"...","hindiDefinition":"...","example":"..."}],"synonyms":["..."],"antonyms":["..."]}]}',
    ].join("\n"),
    maxOutputTokens: 650,
    temperature: 0.2,
  });

  const parsedMeaning = cachedMeaningSchema.parse(parseAiJson(aiResult.text));
  const stableMeaning: CachedMeaningResult = {
    ...parsedMeaning,
    phonetics,
  };

  await prisma.wordMeaningCache.upsert({
    where: {
      lookupKey,
    },
    update: {
      hindiTranslation: stableMeaning.hindiTranslation ?? null,
      meanings: toInputJson(stableMeaning.meanings),
      phonetic: stableMeaning.phonetic ?? null,
      phonetics: toInputJson(stableMeaning.phonetics),
      word: stableMeaning.word,
    },
    create: {
      hindiTranslation: stableMeaning.hindiTranslation ?? null,
      lookupKey,
      meanings: toInputJson(stableMeaning.meanings),
      phonetic: stableMeaning.phonetic ?? null,
      phonetics: toInputJson(stableMeaning.phonetics),
      word: stableMeaning.word,
    },
  });

  return stableMeaning;
}

interface GenerateContextMeaningOptions {
  contextSentence: string;
  meanings: CachedMeaningResult["meanings"];
  word: string;
}

/**
 * Generates a short Hindi explanation for how the selected word is used in the given sentence.
 * @param options The selected word, sentence, and resolved stable meanings.
 * @returns The optional context-specific Hindi explanation.
 */
async function generateContextMeaning({
  contextSentence,
  meanings,
  word,
}: GenerateContextMeaningOptions): Promise<MeaningContextResult> {
  const aiResult = await generateText({
    model: defaultModel,
    system: [
      "You are a precise bilingual reading assistant for English learners.",
      "Return only valid JSON inside <result></result> tags.",
      "Explain in short Hindi how the selected word fits in the given sentence.",
      "Use the provided dictionary senses to disambiguate the usage.",
      "Keep the explanation concise and natural.",
      "Do not include markdown, explanations, or extra text outside the tags.",
    ].join(" "),
    prompt: [
      `Word: ${word}`,
      `Sentence context: ${contextSentence}`,
      `Dictionary senses: ${JSON.stringify(meanings)}`,
      "Respond in this JSON shape:",
      '{"hindiHowItFitsInContext":"..."}',
    ].join("\n"),
    maxOutputTokens: 180,
    temperature: 0.2,
  });

  return meaningContextSchema.parse(parseAiJson(aiResult.text));
}

/**
 * Reads a previously cached stable meaning for the normalized lookup key.
 * @param lookupKey The normalized lookup key used for cache retrieval.
 * @returns The cached stable meaning when available and valid.
 */
async function getCachedMeaning(lookupKey: string): Promise<CachedMeaningResult | null> {
  const cachedMeaning = await prisma.wordMeaningCache.findUnique({
    where: {
      lookupKey,
    },
    select: {
      hindiTranslation: true,
      meanings: true,
      phonetic: true,
      phonetics: true,
      word: true,
    },
  });

  if (!cachedMeaning) {
    return null;
  }

  return cachedMeaningSchema.parse({
    hindiTranslation: cachedMeaning.hindiTranslation ?? undefined,
    meanings: cachedMeaning.meanings,
    phonetic: cachedMeaning.phonetic ?? undefined,
    phonetics: cachedMeaning.phonetics,
    word: cachedMeaning.word,
  });
}

/**
 * Extracts and parses the JSON payload wrapped in result tags from an AI response.
 * @param text The raw AI response text.
 * @returns The parsed JSON payload.
 */
function parseAiJson(text: string): unknown {
  const match = text.match(/<result>([\s\S]*?)<\/result>/i);

  if (!match) {
    throw new Error("Failed to parse meaning from AI response.");
  }

  return JSON.parse(match[1].trim()) as unknown;
}

/**
 * Casts a validated JSON-compatible value into Prisma's input JSON type.
 * @param value The validated structured value to persist.
 * @returns The same value typed for Prisma JSON writes.
 */
function toInputJson(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

/**
 * Normalizes a selected word or phrase into a stable cache key.
 * @param word The raw selected word or phrase.
 * @returns A lowercase lookup key safe for reuse across requests.
 */
function createLookupKey(word: string): string {
  return word.trim().toLowerCase();
}

/**
 * Merges cached phonetics with fresh dictionary pronunciations while deduplicating entries.
 * @param cachedPhonetics The phonetics stored in the cache.
 * @param livePhonetics The latest phonetics resolved from the dictionary API.
 * @returns A compact merged list of phonetic variants.
 */
function mergePhonetics(
  cachedPhonetics: MeaningPhonetic[],
  livePhonetics: MeaningPhonetic[],
): MeaningPhonetic[] {
  const merged = [...livePhonetics, ...cachedPhonetics];
  const seenKeys = new Set<string>();

  return merged.filter((entry) => {
    const key = `${entry.text}|${entry.audio ?? ""}`;

    if (seenKeys.has(key)) {
      return false;
    }

    seenKeys.add(key);
    return true;
  });
}

/**
 * Fetches English pronunciation text/audio from dictionaryapi.dev when available.
 * @param word The word to look up.
 * @returns A compact list of pronunciation entries.
 */
async function getDictionaryPronunciations(word: string): Promise<MeaningPhonetic[]> {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as unknown;

    if (!Array.isArray(data) || !data[0] || typeof data[0] !== "object") {
      return [];
    }

    const phonetics =
      "phonetics" in data[0] && Array.isArray(data[0].phonetics) ? data[0].phonetics : [];

    return phonetics
      .map((entry: unknown) => {
        if (!entry || typeof entry !== "object") {
          return null;
        }

        const text =
          "text" in entry && typeof entry.text === "string" ? entry.text.trim() : "";
        const audio =
          "audio" in entry && typeof entry.audio === "string"
            ? normalizeAudioUrl(entry.audio)
            : undefined;

        if (!text && !audio) {
          return null;
        }

        return {
          audio,
          text: text || word,
        };
      })
      .filter((entry: MeaningPhonetic | null): entry is MeaningPhonetic => entry !== null)
      .slice(0, 5);
  } catch (error) {
    console.error("Failed to fetch pronunciation audio:", error);
    return [];
  }
}

/**
 * Normalizes protocol-relative audio URLs into absolute HTTPS URLs.
 * @param audioUrl The raw audio URL from dictionaryapi.dev.
 * @returns A browser-safe absolute URL when valid.
 */
function normalizeAudioUrl(audioUrl: string): string | undefined {
  if (!audioUrl.trim()) {
    return undefined;
  }

  if (audioUrl.startsWith("//")) {
    return `https:${audioUrl}`;
  }

  return audioUrl;
}
