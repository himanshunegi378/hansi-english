import { z } from "zod";

export const generateStorySchema = z.object({
  prompt: z.string().min(5, "Prompt must be at least 5 characters long").max(500, "Prompt must be less than 500 characters").describe("User provided story prompt"),
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
});

export type QuestionSchemaType = z.infer<typeof questionSchema>;

export const questionsOnlySchema = z.object({
  questions: z.array(questionSchema).describe("List of comprehension questions for the story"),
});


export type QuestionsOnlyResponse = z.infer<typeof questionsOnlySchema>;
