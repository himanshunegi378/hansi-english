"use server";

import { generateText } from "ai";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { defaultModel } from "@/lib/ai";
import prisma from "@/lib/prisma";
import {
  generateStorySchema,
  questionsOnlySchema,
  saveStorySchema,
  type QuestionsOnlyResponse,
  type SaveStoryInput,
  type StoryOnlyResponse,
} from "../schemas";
import { POINTS_PER_QUESTION } from "../const";
import { getStorySystemPrompt, getQuestionSystemPrompt } from "../prompts/story-prompts";
import { mapStoryProgress } from "../story-progress";
import { type EnglishLevel, type PersistedStory, type StoryListItem } from "../types";
import { getOptionalUserId } from "./story-attempt-helpers";

/**
 * Ensures the active user is an admin before allowing protected story mutations.
 * @returns The authenticated admin user identifier.
 */
async function requireAdminUserId(): Promise<string> {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  if (session.user.id) {
    return session.user.id;
  }

  if (!session.user.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user.id;
}

/**
 * Generates a structured story based on a user prompt and level.
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
      const rawQuestions = JSON.parse(questionsMatch[1].trim());
      const questionsData = Array.isArray(rawQuestions)
        ? rawQuestions
        : (rawQuestions as Record<string, unknown>)?.questions;

      const questions = (Array.isArray(questionsData) ? questionsData : []).map((q: Record<string, unknown>) => ({
        ...q,
        valueType: (Array.isArray(q.options) && q.options.length > 0) ? "OPTION" : "TEXT"
      }));

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

/**
 * Saves a generated story and its questions as one atomic database transaction.
 * @param input The generated story payload waiting to be persisted.
 * @returns The newly created persisted story record.
 */
export async function saveGeneratedStoryAction(input: SaveStoryInput, options: {
  userId?: string;
} = {}): Promise<PersistedStory> {
  const createdById = options.userId ?? await requireAdminUserId();

  const result = saveStorySchema.safeParse(input);
  if (!result.success) {
    throw new Error("Invalid story payload");
  }

  const { content, level, prompt, questions, title } = result.data;

  try {
    const story = await prisma.$transaction(async (tx) =>
      tx.story.create({
        data: {
          title,
          content,
          prompt,
          level,
          createdById,
          questions: {
            create: questions.map((question, index) => ({
              text: question.text,
              type: question.type,
              options: question.options ?? [],
              correctAnswer: question.correctAnswer ?? null,
              order: index,
              valueType: question.valueType,
            })),
          },
        },
        include: {
          questions: {
            orderBy: {
              order: "asc",
            },
          },
        },
      })
    );

    revalidatePath("/stories");

    return story;
  } catch (error) {
    console.error("Failed to save story:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to save story. Please try again.");
  }
}

/**
 * Fetches the public saved story list ordered from newest to oldest.
 * @returns A lightweight list representation for the saved stories screen.
 */
export async function getSavedStoriesAction(): Promise<StoryListItem[]> {
  const userId = await getOptionalUserId();
  const stories = await prisma.story.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      content: true,
      level: true,
      createdAt: true,
      _count: {
        select: {
          questions: true,
        },
      },
      ...(userId
        ? {
          progress: {
            where: {
              userId,
            },
            select: {
              earnedPoints: true,
              totalPoints: true,
              completedAt: true,
            },
            take: 1,
          },
        }
        : {}),
    },
  });

  return stories.map((story) => ({
    id: story.id,
    title: story.title,
    content: story.content,
    level: story.level,
    createdAt: story.createdAt.toISOString(),
    questionCount: story._count.questions,
    earnedPoints: story.progress?.[0]?.earnedPoints ?? 0,
    totalPoints:
      story.progress?.[0]?.totalPoints ?? story._count.questions * POINTS_PER_QUESTION,
    isCompleted: Boolean(story.progress?.[0]?.completedAt),
  }));
}

/**
 * Fetches a single saved story and its ordered questions for read-only viewing.
 * @param storyId The persisted story identifier.
 * @returns The saved story with its questions, or null when missing.
 */
export async function getSavedStoryByIdAction(storyId: string): Promise<PersistedStory | null> {
  const userId = await getOptionalUserId();
  const story = await prisma.story.findUnique({
    where: {
      id: storyId,
    },
    include: {
      questions: {
        orderBy: {
          order: "asc",
        },
      },
      ...(userId
        ? {
          progress: {
            where: {
              userId,
            },
            include: {
              answers: {
                orderBy: {
                  question: {
                    order: "asc",
                  },
                },
                select: {
                  questionId: true,
                  valueType: true,
                  selectedOption: true,
                  textAnswer: true,
                  booleanAnswer: true,
                  isCorrect: true,
                  pointsEarned: true,
                  feedback: true,
                },
              },
            },
            take: 1,
          },
        }
        : {}),
    },
  });

  if (!story) {
    return null;
  }

  return {
    ...story,
    viewerProgress: mapStoryProgress(story.progress?.[0] ?? null),
  };
}
