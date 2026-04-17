import { type EnglishLevel } from "../types";

const storyGenerationRules = {
    BEGINNER: [
        "Use very simple, common vocabulary.",
        "Write short, clear sentences.",
        "Keep one idea per sentence.",
        "Use mostly simple present or simple past.",
        "Avoid idioms, slang, metaphors, and advanced grammar.",
        "Keep the plot straightforward and easy to follow.",
        "Use 2-3 characters maximum.",
        "Story length: 150-300 words.",
        "Keep the story engaging, warm, and easy to follow.",
        "Match vocabulary, sentence structure, and grammar strictly to the chosen level.",
        "Do not mix advanced language into beginner stories.",
        "Make the story complete with a beginning, middle, and end.",
        "Provide a simple, descriptive title for the story."
    ],
    INTERMEDIATE: [
        "Use clear, natural English with moderate variety.",
        "Mix simple and moderately complex sentences.",
        "Allow some richer vocabulary, but keep meaning clear from context.",
        "Use simple past, present, continuous forms, and present perfect where natural.",
        "Add more description and emotion.",
        "Include a clear main event and light supporting detail.",
        "Story length: 300-700 words.",
        "Keep the story engaging, warm, and easy to follow.",
        "Match vocabulary, sentence structure, and grammar strictly to the chosen level.",
        "Make the story complete with a beginning, middle, and end.",
        "Provide an engaging, clear title for the story."
    ],
    ADVANCED: [
        "Use fluent, natural English with varied sentence structure.",
        "Allow richer vocabulary and nuanced emotions.",
        "Include layered character thoughts and more detailed storytelling.",
        "Use figurative language sparingly and only when helpful.",
        "Grammar may include complex clauses and advanced structures.",
        "Story length: 700-1200 words.",
        "Keep the story engaging, warm, and easy to follow.",
        "Match vocabulary, sentence structure, and grammar strictly to the chosen level.",
        "Make the story complete with a beginning, middle, and end.",
        "Provide a sophisticated, thematic title for the story."
    ]
};

const questionGenerationRules = {
    BEGINNER: [
        "Create 4-6 questions.",
        "Focus on COMPREHENSION (direct facts), VOCABULARY (basic word meaning), and PERSONAL_RESPONSE (learner's opinion).",
        "Use very simple English for all questions.",
        "For VOCABULARY and COMPREHENSION questions, provide 4 clear multiple-choice options."
    ],
    INTERMEDIATE: [
        "Create 5-7 questions.",
        "Cover COMPREHENSION, VOCABULARY (in context), INFERENCE (reading between the lines), and PERSONAL_RESPONSE.",
        "Use clear but natural English.",
        "Provide 4 multiple-choice options for all except PERSONAL_RESPONSE questions."
    ],
    ADVANCED: [
        "Create 6-8 questions.",
        "Apply all types: COMPREHENSION, VOCABULARY (nuance/style), INFERENCE, ANALYSIS, and PERSONAL_RESPONSE.",
        "Use natural academic-friendly English for all questions.",
        "Mix open-ended and multiple-choice (with 4 options) where appropriate."
    ]
};

/**
 * Builds the shared system prompt for story generation.
 * @param level The target English-learning difficulty.
 * @returns The stable story-writing instructions for the model.
 */
export function getStorySystemPrompt(level: EnglishLevel) {
    const currentLevelStoryRules = storyGenerationRules[level].map(rule => `- ${rule}`).join("\n");

    return `You are a creative writer and English language teacher. 
Create a story based on the user's prompt at the ${level} level.

RULES FOR STORY GENERATION (${level}):
${currentLevelStoryRules}

OUTPUT FORMAT:
Your entire response must be wrapped in specific tags:
<title>The engaging story title</title>
<content>
The full story content, formatted with clear paragraphs.
</content>

Do not include any preamble or conversational intro/outro. Only the tagged content is allowed.`;
}

/**
 * Builds the shared system prompt for question generation.
 * Story-specific content is passed separately in the user prompt.
 * @param level The target English-learning difficulty.
 * @returns The stable question-writing instructions for the model.
 */
export function getQuestionSystemPrompt(level: EnglishLevel) {
    const currentLevelQuestionRules = questionGenerationRules[level].map(rule => `- ${rule}`).join("\n");

    return `You are an English language teacher. 
Generate comprehension questions for the provided story at the ${level} level.

RULES FOR QUESTION GENERATION (${level}):
${currentLevelQuestionRules}

OUTPUT FORMAT:
Your response must be a JSON array of question objects wrapped in a <questions> tag:
<questions>
[
  {
    "text": "Question text here?",
    "type": "COMPREHENSION",
    "options": ["Home", "Market", "School", "Park"],
    "correctAnswer": "Home"
  }
]
</questions>

IMPORTANT RULES FOR MULTIPLE-CHOICE QUESTIONS:
- If a question has an "options" array, "correctAnswer" must be the exact full text of one option from that array.
- Never use option letters such as "A", "B", "C", or "D" as the correctAnswer.
- Never use labels like "Option A" or "Choice B" as the correctAnswer.
- The value of "correctAnswer" must exactly match one string inside "options", character-for-character.
- Example:
  - options: ["Teacher", "Clerk", "Doctor", "Engineer"]
  - correctAnswer: "Doctor"
  - invalid correctAnswer values: "C", "Option C", "choice 3"


Valid question types are: COMPREHENSION, VOCABULARY, INFERENCE, PERSONAL_RESPONSE, ANALYSIS.
Do not include any preamble or conversational intro/outro.`;
}

/**
 * Builds the request-specific user prompt for story generation.
 * @param prompt The story idea supplied by the user.
 * @returns The user prompt body sent to the model.
 */
export function getStoryUserPrompt(prompt: string) {
    return `Provide a story about: ${prompt}`;
}

/**
 * Builds the request-specific user prompt for question generation.
 * @param storyContent The story that the questions should be based on.
 * @returns The user prompt body sent to the model.
 */
export function getQuestionUserPrompt(storyContent: string) {
    return [
        "Generate comprehension questions for this story:",
        "<story>",
        storyContent,
        "</story>",
    ].join("\n");
}
