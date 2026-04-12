import { z } from "zod";

export const generateStorySchema = z.object({
  prompt: z.string().max(5000, "Prompt must be less than 5000 characters").describe("User provided story prompt"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).describe("English proficiency level targeting"),
});

export type GenerateStoryInput = z.infer<typeof generateStorySchema>;

export const storyOnlySchema = z.object({
  title: z.string().describe("Engaging title of the story"),
  content: z.string().describe("The full story content properly formatted in paragraphs"),
});

export type StoryOnlyResponse = z.infer<typeof storyOnlySchema>;

export const questionSchema = z.object({
  text: z.string().describe("The text of the comprehension question"),
  type: z.enum(["COMPREHENSION", "VOCABULARY", "INFERENCE", "PERSONAL_RESPONSE", "ANALYSIS"]).describe("The category of the question based on generation rules"),
  options: z.array(z.string()).optional().describe("Multiple choice options if applicable"),
  correctAnswer: z.string().optional().describe("The correct answer for the question"),
  valueType: z.enum(["OPTION", "TEXT", "BOOLEAN"]).describe("The intent of the question (Multiple Choice, Open-ended, etc.)"),
});

export type QuestionSchemaType = z.infer<typeof questionSchema>;

export const questionsOnlySchema = z.object({
  questions: z.array(questionSchema).describe("List of comprehension questions for the story"),
});


export type QuestionsOnlyResponse = z.infer<typeof questionsOnlySchema>;

export const saveStorySchema = z.object({
  prompt: z.string().min(5).max(5000).describe("Original prompt used to generate the story"),
  title: z.string().min(1).describe("Generated story title"),
  content: z.string().min(1).describe("Generated story content"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).describe("English proficiency level for the story"),
  questions: z.array(questionSchema).min(1).describe("Generated questions to persist with the story"),
});

export type SaveStoryInput = z.infer<typeof saveStorySchema>;
