import { requireQuizManager } from "../auth";
import { QuizError } from "../errors";
import { toQuizQuestionDto, toQuizSectionDto } from "../mappers";
import {
  createQuestionSchema,
  createSectionSchema,
  updateQuestionSchema,
} from "../schemas";
import * as quizRepository from "../repositories/quiz-repository";
import type {
  CreateQuestionInput,
  CreateSectionInput,
  UpdateQuestionInput,
} from "../types";

function isUniqueConstraintError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

/**
 * Creates a section inside a quiz for the authenticated manager.
 * @param quizId Quiz identifier.
 * @param input Raw section payload.
 * @returns Serialized created section.
 */
export async function createSection(quizId: string, input: CreateSectionInput | unknown) {
  await requireQuizManager();
  const result = createSectionSchema.safeParse(input);

  if (!result.success) {
    throw new QuizError(400, "VALIDATION_ERROR", result.error.issues[0]?.message ?? "Invalid section payload.");
  }

  const quiz = await quizRepository.findQuizById(quizId);
  if (!quiz) {
    throw new QuizError(404, "QUIZ_NOT_FOUND", "Quiz not found");
  }

  try {
    const section = await quizRepository.createSection(quizId, result.data);
    return toQuizSectionDto(section);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new QuizError(409, "SECTION_ORDER_ALREADY_EXISTS", "A section with this order already exists in the quiz");
    }

    throw error;
  }
}

/**
 * Creates a question inside a section for the authenticated manager.
 * @param sectionId Section identifier.
 * @param input Raw question payload.
 * @returns Serialized created question.
 */
export async function createQuestion(sectionId: string, input: CreateQuestionInput | unknown) {
  await requireQuizManager();
  const result = createQuestionSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];
    throw new QuizError(400, issue?.message === "Single choice question must have exactly one correct option." ? "INVALID_QUESTION_OPTIONS" : "VALIDATION_ERROR", issue?.message ?? "Invalid question payload.");
  }

  const section = await quizRepository.findSectionById(sectionId);
  if (!section) {
    throw new QuizError(404, "SECTION_NOT_FOUND", "Section not found");
  }

  try {
    const question = await quizRepository.createQuestion(sectionId, result.data);
    return toQuizQuestionDto(question, true);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new QuizError(409, "QUESTION_ORDER_ALREADY_EXISTS", "A question with this order already exists in the section");
    }

    throw error;
  }
}

/**
 * Updates an existing question for the authenticated manager.
 * @param questionId Question identifier.
 * @param input Raw question update payload.
 * @returns Serialized updated question.
 */
export async function updateQuestion(questionId: string, input: UpdateQuestionInput | unknown) {
  await requireQuizManager();
  const result = updateQuestionSchema.safeParse(input);

  if (!result.success) {
    throw new QuizError(400, "VALIDATION_ERROR", result.error.issues[0]?.message ?? "Invalid question payload.");
  }

  const existingQuestion = await quizRepository.findQuestionById(questionId);
  if (!existingQuestion) {
    throw new QuizError(404, "QUESTION_NOT_FOUND", "Question not found");
  }

  try {
    const updatedQuestion = await quizRepository.updateQuestion(questionId, result.data);
    return toQuizQuestionDto(updatedQuestion, true);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new QuizError(409, "QUESTION_ORDER_ALREADY_EXISTS", "A question with this order already exists in the section");
    }

    throw error;
  }
}

/**
 * Deletes a question for the authenticated manager.
 * @param questionId Question identifier.
 */
export async function deleteQuestion(questionId: string): Promise<void> {
  await requireQuizManager();
  const question = await quizRepository.findQuestionById(questionId);

  if (!question) {
    throw new QuizError(404, "QUESTION_NOT_FOUND", "Question not found");
  }

  await quizRepository.deleteQuestion(questionId);
}
