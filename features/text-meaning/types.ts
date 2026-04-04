/**
 * Viewport coordinates for the active text selection.
 */
export interface SelectionPosition {
  top: number;
  left: number;
}

/**
 * The currently selected text and its screen position.
 */
export interface SelectedText {
  position: SelectionPosition;
  text: string;
}

/**
 * License metadata returned by the dictionary API.
 */
export interface DictionaryLicense {
  name: string;
  url: string;
}

/**
 * A single definition item from the dictionary API.
 */
export interface DictionaryDefinition {
  definition: string;
  synonyms: string[];
  antonyms: string[];
  example?: string;
}

/**
 * A meaning group from the dictionary API.
 */
export interface DictionaryMeaning {
  partOfSpeech: string;
  definitions: DictionaryDefinition[];
  synonyms: string[];
  antonyms: string[];
}

/**
 * Pronunciation metadata returned by the dictionary API.
 */
export interface DictionaryPhonetic {
  text?: string;
  audio?: string;
  sourceUrl?: string;
  license?: DictionaryLicense;
}

/**
 * A single dictionary entry returned by the public API.
 */
export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics: DictionaryPhonetic[];
  meanings: DictionaryMeaning[];
  license?: DictionaryLicense;
  sourceUrls: string[];
}

/**
 * Full response payload returned by the public dictionary API.
 */
export type DictionaryApiResponse = DictionaryEntry[];

/**
 * Tooltip-facing dictionary data for the selected word.
 */
export type MeaningResult = DictionaryEntry;
