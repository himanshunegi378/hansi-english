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
  contextSentence?: string;
  position: SelectionPosition;
  text: string;
}

/**
 * A single meaning entry returned by the AI meaning service.
 */
export interface MeaningDefinition {
  definition: string;
  hindiDefinition?: string;
  example?: string;
}

/**
 * A pronunciation variant for the selected word.
 */
export interface MeaningPhonetic {
  audio?: string;
  text: string;
}

/**
 * A part-of-speech group returned by the AI meaning service.
 */
export interface MeaningGroup {
  partOfSpeech: string;
  definitions: MeaningDefinition[];
  synonyms: string[];
  antonyms: string[];
}

/**
 * Stable word meaning fields that can be cached across contexts.
 */
export interface CachedMeaningResult {
  word: string;
  phonetic?: string;
  phonetics: MeaningPhonetic[];
  hindiTranslation?: string;
  meanings: MeaningGroup[];
}

/**
 * Context-sensitive explanation for how the selected word fits a sentence.
 */
export interface MeaningContextResult {
  hindiHowItFitsInContext?: string;
}

/**
 * Structured word meaning data returned to the tooltip UI.
 */
export type MeaningResult = CachedMeaningResult & MeaningContextResult;

/**
 * The validated input for generating a word meaning.
 */
export interface GetWordMeaningInput {
  contextSentence?: string;
  word: string;
}

/**
 * The serialized AI response contract returned by the server action.
 */
export type GetWordMeaningResponse = MeaningResult;
