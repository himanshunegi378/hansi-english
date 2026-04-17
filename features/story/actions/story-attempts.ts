"use server";

import { generateText } from "ai";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { defaultModel } from "@/lib/ai";
import prisma from "@/lib/prisma";
import type { StoryProgress, SubmitStoryAnswerInput } from "../types";
import { POINTS_PER_QUESTION } from "../const";
import { mapStoryProgress } from "../story-progress";
import { requireAuthenticatedUserId } from "./story-attempt-helpers";

const submitStoryAnswerSchema = z
  .object({
    storyId: z.string().min(1),
    questionId: z.string().min(1),
    valueType: z.enum(["OPTION", "TEXT", "BOOLEAN"]),
    selectedOption: z.string().trim().min(1).optional().nullable(),
    textAnswer: z.string().trim().min(1).max(1000).optional().nullable(),
    booleanAnswer: z.boolean().optional().nullable(),
  })
  .superRefine((input, ctx) => {
    if (input.valueType === "OPTION" && !input.selectedOption) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["selectedOption"],
        message: "Please choose an answer.",
      });
    }

    if (input.valueType === "TEXT" && !input.textAnswer) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["textAnswer"],
        message: "Please enter your answer.",
      });
    }

    if (input.valueType === "BOOLEAN" && typeof input.booleanAnswer !== "boolean") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["booleanAnswer"],
        message: "Please choose true or false.",
      });
    }
  });

const subjectiveEvaluationSchema = z.object({
  correct: z.boolean(),
  feedback: z.string().min(1).max(240),
});

interface SubmitStoryAnswerResult {
  answer: StoryProgress["answers"][number];
  progress: StoryProgress;
}

/**
 * Grades and persists a learner answer for one story question.
 * @param input The submitted answer payload for the active user.
 * @returns The saved answer and updated story progress summary.
 */
export async function submitStoryAnswerAction(
  input: SubmitStoryAnswerInput,
): Promise<SubmitStoryAnswerResult> {
  const userId = await requireAuthenticatedUserId();
  const result = submitStoryAnswerSchema.safeParse(input);

  if (!result.success) {
    throw new Error(result.error.issues[0]?.message ?? "Invalid answer.");
  }

  const answerInput = result.data;
  const question = await prisma.question.findUnique({
    where: {
      id: answerInput.questionId,
    },
    select: {
      id: true,
      storyId: true,
      text: true,
      type: true,
      options: true,
      correctAnswer: true,
      story: {
        select: {
          content: true,
          _count: {
            select: {
              questions: true,
            },
          },
        },
      },
    },
  });

  if (!question || question.storyId !== answerInput.storyId) {
    throw new Error("Question not found.");
  }

  const gradedAnswer = await gradeStoryAnswer({
    correctAnswer: question.correctAnswer,
    options: question.options,
    storyContent: question.story.content,
    submittedAnswer: answerInput,
    questionText: question.text,
    questionType: question.type,
  });

  const progress = await prisma.$transaction(async (tx) => {
    const ensuredProgress = await tx.storyProgress.upsert({
      where: {
        userId_storyId: {
          userId,
          storyId: answerInput.storyId,
        },
      },
      update: {
        totalPoints: question.story._count.questions * POINTS_PER_QUESTION,
      },
      create: {
        userId,
        storyId: answerInput.storyId,
        totalPoints: question.story._count.questions * POINTS_PER_QUESTION,
      },
      select: {
        id: true,
      },
    });

    await tx.storyAnswer.upsert({
      where: {
        progressId_questionId: {
          progressId: ensuredProgress.id,
          questionId: question.id,
        },
      },
      update: {
        valueType: answerInput.valueType,
        selectedOption: answerInput.valueType === "OPTION" ? answerInput.selectedOption ?? null : null,
        textAnswer: answerInput.valueType === "TEXT" ? answerInput.textAnswer ?? null : null,
        booleanAnswer: answerInput.valueType === "BOOLEAN" ? answerInput.booleanAnswer ?? null : null,
        isCorrect: gradedAnswer.isCorrect,
        pointsEarned: gradedAnswer.pointsEarned,
        feedback: gradedAnswer.feedback,
      },
      create: {
        progressId: ensuredProgress.id,
        questionId: question.id,
        valueType: answerInput.valueType,
        selectedOption: answerInput.valueType === "OPTION" ? answerInput.selectedOption ?? null : null,
        textAnswer: answerInput.valueType === "TEXT" ? answerInput.textAnswer ?? null : null,
        booleanAnswer: answerInput.valueType === "BOOLEAN" ? answerInput.booleanAnswer ?? null : null,
        isCorrect: gradedAnswer.isCorrect,
        pointsEarned: gradedAnswer.pointsEarned,
        feedback: gradedAnswer.feedback,
      },
    });

    const [answerCount, aggregate] = await Promise.all([
      tx.storyAnswer.count({
        where: {
          progressId: ensuredProgress.id,
        },
      }),
      tx.storyAnswer.aggregate({
        where: {
          progressId: ensuredProgress.id,
        },
        _sum: {
          pointsEarned: true,
        },
      }),
    ]);

    return tx.storyProgress.update({
      where: {
        id: ensuredProgress.id,
      },
      data: {
        earnedPoints: aggregate._sum.pointsEarned ?? 0,
        lastAnsweredAt: new Date(),
        completedAt:
          answerCount === question.story._count.questions ? new Date() : null,
      },
      select: {
        id: true,
        earnedPoints: true,
        totalPoints: true,
        completedAt: true,
        lastAnsweredAt: true,
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
    });
  });

  revalidatePath("/stories");
  revalidatePath("/story");

  const normalizedProgress = mapStoryProgress(progress);

  if (!normalizedProgress) {
    throw new Error("Failed to save story progress.");
  }

  const savedAnswer = normalizedProgress.answers.find(
    (answer) => answer.questionId === answerInput.questionId,
  );

  if (!savedAnswer) {
    throw new Error("Failed to load saved answer.");
  }

  return {
    answer: savedAnswer,
    progress: normalizedProgress,
  };
}

interface GradeStoryAnswerOptions {
  correctAnswer: string | null;
  options: string[];
  storyContent: string;
  submittedAnswer: z.infer<typeof submitStoryAnswerSchema>;
  questionText: string;
  questionType: string;
}

/**
 * Grades one submitted answer using deterministic checks or AI evaluation.
 * @param options The question context and submitted answer value.
 * @returns The normalized grading result.
 */
async function gradeStoryAnswer({
  correctAnswer,
  options,
  storyContent,
  submittedAnswer,
  questionText,
  questionType,
}: GradeStoryAnswerOptions): Promise<{
  feedback: string | null;
  isCorrect: boolean;
  pointsEarned: number;
}> {
  if (submittedAnswer.valueType === "OPTION") {
    const isCorrect = submittedAnswer.selectedOption === correctAnswer;

    return {
      isCorrect,
      pointsEarned: isCorrect ? POINTS_PER_QUESTION : 0,
      feedback: isCorrect ? "Correct answer." : "Not quite. Review the story and try again.",
    };
  }

  if (submittedAnswer.valueType === "BOOLEAN") {
    const normalizedCorrect = normalizeBooleanAnswer(correctAnswer);
    const isCorrect =
      typeof normalizedCorrect === "boolean" &&
      normalizedCorrect === submittedAnswer.booleanAnswer;

    return {
      isCorrect,
      pointsEarned: isCorrect ? POINTS_PER_QUESTION : 0,
      feedback: isCorrect ? "Correct answer." : "That boolean answer does not match the answer key.",
    };
  }

  const evaluation = await evaluateSubjectiveAnswer({
    correctAnswer,
    options,
    questionText,
    questionType,
    storyExcerpt: selectRelevantStoryExcerpt({
      correctAnswer,
      options,
      questionText,
      storyContent,
      userAnswer: submittedAnswer.textAnswer ?? "",
    }),
    userAnswer: submittedAnswer.textAnswer ?? "",
  });

  return {
    isCorrect: evaluation.correct,
    pointsEarned: evaluation.correct ? POINTS_PER_QUESTION : 0,
    feedback: evaluation.feedback,
  };
}

interface EvaluateSubjectiveAnswerOptions {
  correctAnswer: string | null;
  options: string[];
  questionText: string;
  questionType: string;
  storyExcerpt: string;
  userAnswer: string;
}

/**
 * Uses AI to decide whether a subjective answer matches the story intent.
 * @param options The story, question, answer key, and learner response.
 * @returns A binary evaluation with short learner feedback.
 */
async function evaluateSubjectiveAnswer({
  correctAnswer,
  options,
  questionText,
  questionType,
  storyExcerpt,
  userAnswer,
}: EvaluateSubjectiveAnswerOptions): Promise<z.infer<typeof subjectiveEvaluationSchema>> {
  const { text } = await generateText({
    model: defaultModel,
    system: [
      "You grade English-learning comprehension answers.",
      "Return only valid JSON inside <result></result> tags.",
      "Decide if the learner answer should count as correct.",
      "Be tolerant of simple grammar mistakes and short paraphrases.",
      "Mark correct only when the answer clearly matches the story meaning or teacher answer guide.",
      "Keep feedback short, supportive, and specific.",
    ].join(" "),
    prompt: [
      `Question type: ${questionType}`,
      `Question: ${questionText}`,
      `Relevant story excerpt: ${storyExcerpt}`,
      `Answer guide: ${correctAnswer ?? "No exact answer guide provided."}`,
      `Options: ${options.length > 0 ? options.join(" | ") : "No options"}`,
      `Learner answer: ${userAnswer}`,
      'Respond with: {"correct":true,"feedback":"..."}',
    ].join("\n"),
    maxOutputTokens: 180,
    temperature: 0.1,
  });

  return subjectiveEvaluationSchema.parse(parseTaggedJson(text));
}

/**
 * Extracts the JSON payload wrapped in result tags from an AI response.
 * @param text The raw model output.
 * @returns The parsed JSON payload.
 */
function parseTaggedJson(text: string): unknown {
  const match = text.match(/<result>([\s\S]*?)<\/result>/i);

  if (!match) {
    throw new Error("Failed to parse subjective answer evaluation.");
  }

  return JSON.parse(match[1].trim()) as unknown;
}

interface SelectRelevantStoryExcerptOptions {
  correctAnswer: string | null;
  options: string[];
  questionText: string;
  storyContent: string;
  userAnswer: string;
}

/**
 * Picks a compact story excerpt so grading focuses on the most relevant evidence.
 * Falls back to the opening of the story when keyword matching is weak.
 * @param options The full story and grading clues used to rank candidate sentences.
 * @returns A short excerpt suitable for the grading prompt.
 */
function selectRelevantStoryExcerpt({
  correctAnswer,
  options,
  questionText,
  storyContent,
  userAnswer,
}: SelectRelevantStoryExcerptOptions): string {
  const sentences = splitStoryIntoSentences(storyContent);

  if (sentences.length === 0) {
    return storyContent.trim().slice(0, 700);
  }

  const keywords = buildStoryKeywords({
    correctAnswer,
    options,
    questionText,
    userAnswer,
  });

  const rankedSentences = sentences
    .map((sentence, index) => ({
      index,
      score: scoreStorySentence(sentence, keywords),
      sentence,
    }))
    .sort((left, right) => {
      if (right.score === left.score) {
        return left.index - right.index;
      }

      return right.score - left.score;
    });

  const topMatches = rankedSentences
    .filter((entry) => entry.score > 0)
    .slice(0, 3)
    .sort((left, right) => left.index - right.index)
    .map((entry) => entry.sentence);

  if (topMatches.length > 0) {
    return topMatches.join(" ").slice(0, 700);
  }

  return sentences.slice(0, 3).join(" ").slice(0, 700);
}

interface BuildStoryKeywordsOptions {
  correctAnswer: string | null;
  options: string[];
  questionText: string;
  userAnswer: string;
}

/**
 * Extracts useful keywords from the grading inputs to localize the relevant excerpt.
 * @param options The question and answer signals that hint at the key story passage.
 * @returns A deduplicated list of lowercase keywords.
 */
function buildStoryKeywords({
  correctAnswer,
  options,
  questionText,
  userAnswer,
}: BuildStoryKeywordsOptions): string[] {
  const sources = [questionText, correctAnswer ?? "", options.join(" "), userAnswer];

  return Array.from(
    new Set(
      sources
        .flatMap((value) => value.toLowerCase().match(/[a-z]+/g) ?? [])
        .filter((word) => word.length >= 4)
        .filter((word) => !COMMON_STORY_STOP_WORDS.has(word)),
    ),
  );
}

/**
 * Splits story prose into sentence-like chunks for excerpt ranking.
 * @param storyContent The full story body.
 * @returns Non-empty sentence fragments.
 */
function splitStoryIntoSentences(storyContent: string): string[] {
  return storyContent
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
}

/**
 * Scores one story sentence against the extracted grading keywords.
 * @param sentence The candidate story sentence.
 * @param keywords The keywords that indicate relevance.
 * @returns A simple overlap score.
 */
function scoreStorySentence(sentence: string, keywords: string[]): number {
  const lowercaseSentence = sentence.toLowerCase();
  let score = 0;

  for (const keyword of keywords) {
    if (lowercaseSentence.includes(keyword)) {
      score += 1;
    }
  }

  return score;
}

const COMMON_STORY_STOP_WORDS = new Set([
  "about",
  "after",
  "before",
  "could",
  "learner",
  "question",
  "story",
  "their",
  "there",
  "these",
  "those",
  "which",
  "would",
]);

/**
 * Normalizes a textual boolean answer key into a real boolean value.
 * @param value The stored answer key.
 * @returns A boolean when the key can be interpreted safely.
 */
function normalizeBooleanAnswer(value: string | null): boolean | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === "true" || normalized === "yes") {
    return true;
  }

  if (normalized === "false" || normalized === "no") {
    return false;
  }

  return null;
}
