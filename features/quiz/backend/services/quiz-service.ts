import { z } from "zod";
import { actions, defineAbilitiesFor, subjects } from "@/lib/casl/ability";
import { QuizStatus } from "@/generated/prisma/client";
import { requireQuizManager, requireQuizUser } from "../auth";
import { QuizError } from "../errors";
import { toQuizDetailDto, toQuizSummary } from "../mappers";
import { createQuizSchema, updateQuizSchema } from "../schemas";
import * as quizRepository from "../repositories/quiz-repository";
import type {
  CreateQuizInput,
  QuizListResponseDto,
  UpdateQuizInput,
} from "../types";

const listQuizFiltersSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
  status: z.nativeEnum(QuizStatus).optional(),
});

function getQuestionCount(quiz: NonNullable<Awaited<ReturnType<typeof quizRepository.findQuizForManagement>>>) {
  return quiz.sections.reduce((total, section) => total + section._count.questions, 0);
}

async function requireExistingQuiz(quizId: string) {
  const quiz = await quizRepository.findQuizById(quizId);

  if (!quiz) {
    throw new QuizError(404, "QUIZ_NOT_FOUND", "Quiz not found");
  }

  return quiz;
}

/**
 * Lists quizzes visible to the current authenticated user.
 * @param rawFilters Raw pagination and status filters.
 * @returns Paginated quiz list response.
 */
export async function listQuizzes(rawFilters: unknown): Promise<QuizListResponseDto> {
  const user = await requireQuizUser();
  const parsedFilters = listQuizFiltersSchema.safeParse(rawFilters);

  if (!parsedFilters.success) {
    throw new QuizError(400, "VALIDATION_ERROR", parsedFilters.error.issues[0]?.message ?? "Invalid quiz list filters.");
  }

  const ability = defineAbilitiesFor(user.role);
  const canManageQuizzes = ability.can(actions.manage, subjects.quiz);
  const where = canManageQuizzes
    ? {
        ...(parsedFilters.data.status ? { status: parsedFilters.data.status } : {}),
      }
    : parsedFilters.data.status && parsedFilters.data.status !== QuizStatus.PUBLISHED
      ? {
          id: "__no_visible_quizzes__",
        }
      : {
          status: QuizStatus.PUBLISHED,
        };

  const { items, total } = await quizRepository.listQuizzes(parsedFilters.data, where);
  const totalPages = Math.max(1, Math.ceil(total / parsedFilters.data.pageSize));

  return {
    items: items.map(toQuizSummary),
    pagination: {
      page: parsedFilters.data.page,
      pageSize: parsedFilters.data.pageSize,
      total,
      totalPages,
    },
  };
}

/**
 * Creates a new quiz for the authenticated manager.
 * @param input Raw quiz payload.
 * @returns Serialized created quiz.
 */
export async function createQuiz(input: CreateQuizInput | unknown) {
  const user = await requireQuizManager();
  const result = createQuizSchema.safeParse(input);

  if (!result.success) {
    throw new QuizError(400, "VALIDATION_ERROR", result.error.issues[0]?.message ?? "Invalid quiz payload.");
  }

  if (result.data.status === QuizStatus.PUBLISHED) {
    throw new QuizError(400, "QUIZ_INCOMPLETE", "Quiz must contain at least one question before publishing.");
  }

  const quiz = await quizRepository.createQuiz(user.id, result.data);
  return {
    ...toQuizSummary(quiz),
    createdById: quiz.createdById,
  };
}

/**
 * Loads a single quiz visible to the current user.
 * @param quizId Quiz identifier from route params.
 * @returns Serialized quiz detail payload.
 */
export async function getQuiz(quizId: string) {
  const user = await requireQuizUser();
  const ability = defineAbilitiesFor(user.role);
  const canManageQuizzes = ability.can(actions.manage, subjects.quiz);
  const quiz = await requireExistingQuiz(quizId);

  if (!canManageQuizzes && quiz.status !== QuizStatus.PUBLISHED) {
    throw new QuizError(404, "QUIZ_NOT_FOUND", "Quiz not found");
  }

  return toQuizDetailDto(quiz, canManageQuizzes);
}

/**
 * Updates a quiz for the authenticated manager.
 * @param quizId Quiz identifier.
 * @param input Raw quiz update payload.
 * @returns Serialized updated quiz summary.
 */
export async function updateQuiz(quizId: string, input: UpdateQuizInput | unknown) {
  await requireQuizManager();
  const result = updateQuizSchema.safeParse(input);

  if (!result.success) {
    throw new QuizError(400, "VALIDATION_ERROR", result.error.issues[0]?.message ?? "Invalid quiz payload.");
  }

  const existingQuiz = await quizRepository.findQuizForManagement(quizId);
  if (!existingQuiz) {
    throw new QuizError(404, "QUIZ_NOT_FOUND", "Quiz not found");
  }

  if (existingQuiz.status === QuizStatus.DRAFT && result.data.status === QuizStatus.ARCHIVED) {
    throw new QuizError(400, "INVALID_STATUS_TRANSITION", "Cannot archive a draft quiz directly");
  }

  if (result.data.status === QuizStatus.PUBLISHED && getQuestionCount(existingQuiz) === 0) {
    throw new QuizError(400, "QUIZ_INCOMPLETE", "Quiz must contain at least one question before publishing.");
  }

  const quiz = await quizRepository.updateQuiz(quizId, result.data);
  return toQuizSummary(quiz);
}

/**
 * Publishes a quiz after verifying it contains at least one question.
 * @param quizId Quiz identifier.
 * @returns Serialized publish action result.
 */
export async function publishQuiz(quizId: string) {
  await requireQuizManager();
  const quiz = await quizRepository.findQuizForManagement(quizId);

  if (!quiz) {
    throw new QuizError(404, "QUIZ_NOT_FOUND", "Quiz not found");
  }

  if (getQuestionCount(quiz) === 0) {
    throw new QuizError(400, "QUIZ_INCOMPLETE", "Quiz must contain at least one question before publishing.");
  }

  const updatedQuiz = await quizRepository.updateQuiz(quizId, {
    status: QuizStatus.PUBLISHED,
  });

  return {
    id: updatedQuiz.id,
    status: updatedQuiz.status,
    updatedAt: updatedQuiz.updatedAt.toISOString(),
  };
}

/**
 * Archives a quiz for the authenticated manager.
 * @param quizId Quiz identifier.
 * @returns Serialized archive action result.
 */
export async function archiveQuiz(quizId: string) {
  await requireQuizManager();
  await requireExistingQuiz(quizId);

  const updatedQuiz = await quizRepository.updateQuiz(quizId, {
    status: QuizStatus.ARCHIVED,
  });

  return {
    id: updatedQuiz.id,
    status: updatedQuiz.status,
    updatedAt: updatedQuiz.updatedAt.toISOString(),
  };
}
