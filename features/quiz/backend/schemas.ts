import { z } from "zod";
import {
  QuizQuestionType,
  QuizStatus,
} from "@/generated/prisma/client";

const questionOptionSchema = z.object({
  text: z.string().trim().min(1, "Option text is required.").max(500, "Option text must be 500 characters or fewer."),
  order: z.int().positive("Option order must be greater than 0."),
  isCorrect: z.boolean(),
});

/**
 * Validates quiz creation payloads.
 */
export const createQuizSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(160, "Title must be 160 characters or fewer."),
  description: z.string().trim().max(1_000, "Description must be 1000 characters or fewer.").optional().nullable(),
  status: z.nativeEnum(QuizStatus).optional(),
  timeLimitMin: z.int().positive("Time limit must be greater than 0.").max(1_440, "Time limit must be 1440 minutes or fewer.").optional().nullable(),
  passingScore: z.number().min(0, "Passing score must be at least 0.").max(100, "Passing score must be 100 or fewer.").optional().nullable(),
});

/**
 * Validates quiz update payloads.
 */
export const updateQuizSchema = createQuizSchema
  .partial()
  .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: "At least one field must be provided.",
  });

/**
 * Validates quiz section creation payloads.
 */
export const createSectionSchema = z.object({
  title: z.string().trim().min(1, "Section title is required.").max(160, "Section title must be 160 characters or fewer."),
  description: z.string().trim().max(1_000, "Description must be 1000 characters or fewer.").optional().nullable(),
  order: z.int().positive("Section order must be greater than 0."),
});

/**
 * Validates quiz question creation payloads.
 */
export const createQuestionSchema = z
  .object({
    text: z.string().trim().min(1, "Question text is required.").max(2_000, "Question text must be 2000 characters or fewer."),
    explanation: z.string().trim().max(2_000, "Explanation must be 2000 characters or fewer.").optional().nullable(),
    type: z.nativeEnum(QuizQuestionType),
    order: z.int().positive("Question order must be greater than 0."),
    points: z.number().positive("Points must be greater than 0.").max(1_000, "Points must be 1000 or fewer.").optional(),
    isRequired: z.boolean().optional(),
    options: z.array(questionOptionSchema).min(2, "Choice questions must have at least two options.").optional(),
    correctTextAnswer: z.string().trim().min(1, "Correct text answer cannot be empty.").max(2_000, "Correct text answer must be 2000 characters or fewer.").optional().nullable(),
  })
  .superRefine((input, ctx) => {
    const correctOptionCount = input.options?.filter((option) => option.isCorrect).length ?? 0;

    if (input.type === QuizQuestionType.SHORT_ANSWER) {
      if (!input.correctTextAnswer) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["correctTextAnswer"],
          message: "Short answer questions require correctTextAnswer.",
        });
      }

      if (input.options && input.options.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["options"],
          message: "Short answer questions cannot define options.",
        });
      }
    }

    if (input.type === QuizQuestionType.SINGLE_CHOICE || input.type === QuizQuestionType.TRUE_FALSE) {
      if (!input.options || input.options.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["options"],
          message: "Choice questions must include options.",
        });
      }

      if (correctOptionCount !== 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["options"],
          message: "Single choice question must have exactly one correct option.",
        });
      }
    }

    if (input.type === QuizQuestionType.MULTIPLE_CHOICE) {
      if (!input.options || input.options.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["options"],
          message: "Multiple choice questions must include options.",
        });
      }

      if (correctOptionCount < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["options"],
          message: "Multiple choice questions must have at least one correct option.",
        });
      }
    }
  });

/**
 * Validates partial quiz question updates.
 */
export const updateQuestionSchema = z
  .object({
    text: z.string().trim().min(1, "Question text is required.").max(2_000, "Question text must be 2000 characters or fewer.").optional(),
    explanation: z.string().trim().max(2_000, "Explanation must be 2000 characters or fewer.").optional().nullable(),
    order: z.int().positive("Question order must be greater than 0.").optional(),
    points: z.number().positive("Points must be greater than 0.").max(1_000, "Points must be 1000 or fewer.").optional(),
    isRequired: z.boolean().optional(),
    correctTextAnswer: z.string().trim().min(1, "Correct text answer cannot be empty.").max(2_000, "Correct text answer must be 2000 characters or fewer.").optional().nullable(),
  })
  .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: "At least one field must be provided.",
  });

/**
 * Validates attempt creation payloads.
 */
export const startAttemptSchema = z.object({
  resumeAttemptId: z.string().trim().min(1).optional().nullable(),
});

/**
 * Validates answer save payloads before question-type specific checks.
 */
export const saveAnswerSchema = z.object({
  selectedOptionIds: z.array(z.string().trim().min(1)).optional(),
  textAnswer: z.string().trim().min(1, "textAnswer cannot be empty.").max(2_000, "textAnswer must be 2000 characters or fewer.").optional().nullable(),
});

/**
 * Validates attempt submission payloads.
 */
export const submitAttemptSchema = z.object({
  forceSubmit: z.boolean().optional(),
});

/**
 * Validates manual grading payloads.
 */
export const manualGradeSchema = z.object({
  isCorrect: z.boolean(),
  awardedPoints: z.number().min(0, "Awarded points must be at least 0."),
  feedback: z.string().trim().max(1_000, "Feedback must be 1000 characters or fewer.").optional().nullable(),
});
