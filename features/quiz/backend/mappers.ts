import type {
  Quiz,
  QuizAttempt,
  QuizAttemptAnswer,
  QuizQuestion,
  QuizQuestionOption,
  QuizSection,
} from "@/generated/prisma/client";
import type {
  AttemptAnswerDto,
  AttemptDetailDto,
  AttemptResultAnswerDto,
  AttemptResultDto,
  QuizAttemptDto,
  QuizQuestionDto,
  QuizSectionDto,
  QuizSummaryDto,
  QuizDetailDto,
} from "./types";

type QuizQuestionRecord = QuizQuestion & { options: QuizQuestionOption[] };
type QuizSectionRecord = QuizSection & { questions: QuizQuestionRecord[] };
type QuizRecord = Quiz & { sections: QuizSectionRecord[] };
type QuizAttemptAnswerRecord = QuizAttemptAnswer & {
  selectedOptions: Array<{
    optionId: string;
  }>;
};

/**
 * Converts a Prisma quiz into the public summary shape.
 * @param quiz Prisma quiz record.
 * @returns Serialized quiz summary.
 */
export function toQuizSummary(quiz: Quiz): QuizSummaryDto {
  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    status: quiz.status,
    timeLimitMin: quiz.timeLimitMin,
    passingScore: quiz.passingScore,
    createdAt: quiz.createdAt.toISOString(),
    updatedAt: quiz.updatedAt.toISOString(),
  };
}

/**
 * Converts a Prisma quiz option into the public API shape.
 * @param option Prisma quiz option record.
 * @param includeCorrectness Whether to expose correctness metadata.
 * @returns Serialized option payload.
 */
export function toQuizOptionDto(option: QuizQuestionOption, includeCorrectness: boolean) {
  return {
    id: option.id,
    text: option.text,
    order: option.order,
    ...(includeCorrectness ? { isCorrect: option.isCorrect } : {}),
  };
}

/**
 * Converts a Prisma quiz question into the public API shape.
 * @param question Prisma question with options.
 * @param includeCorrectness Whether to expose answer key fields.
 * @returns Serialized question payload.
 */
export function toQuizQuestionDto(question: QuizQuestionRecord, includeCorrectness: boolean): QuizQuestionDto {
  return {
    id: question.id,
    sectionId: question.sectionId,
    text: question.text,
    explanation: question.explanation,
    type: question.type,
    order: question.order,
    points: question.points,
    isRequired: question.isRequired,
    ...(includeCorrectness ? { correctTextAnswer: question.correctTextAnswer } : {}),
    options: question.options.map((option) => toQuizOptionDto(option, includeCorrectness)),
    createdAt: question.createdAt.toISOString(),
    updatedAt: question.updatedAt.toISOString(),
  };
}

/**
 * Converts a Prisma quiz section into the public API shape.
 * @param section Prisma section with questions.
 * @param includeQuestions Whether to include nested question data.
 * @param includeCorrectness Whether to expose answer key fields.
 * @returns Serialized section payload.
 */
export function toQuizSectionDto(
  section: QuizSectionRecord | QuizSection,
  includeQuestions = false,
  includeCorrectness = false,
): QuizSectionDto {
  return {
    id: section.id,
    quizId: section.quizId,
    title: section.title,
    description: section.description,
    order: section.order,
    ...(includeQuestions && "questions" in section
      ? {
          questions: section.questions.map((question) => toQuizQuestionDto(question, includeCorrectness)),
        }
      : {}),
    createdAt: section.createdAt.toISOString(),
    updatedAt: section.updatedAt.toISOString(),
  };
}

/**
 * Converts a Prisma quiz with nested sections into the public detail shape.
 * @param quiz Prisma quiz with sections and questions.
 * @param includeCorrectness Whether to expose answer key fields.
 * @returns Serialized quiz detail payload.
 */
export function toQuizDetailDto(quiz: QuizRecord, includeCorrectness: boolean): QuizDetailDto {
  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    status: quiz.status,
    timeLimitMin: quiz.timeLimitMin,
    passingScore: quiz.passingScore,
    sections: quiz.sections.map((section) => toQuizSectionDto(section, true, includeCorrectness)),
    createdAt: quiz.createdAt.toISOString(),
    updatedAt: quiz.updatedAt.toISOString(),
  };
}

/**
 * Converts a Prisma attempt into the shared attempt shape.
 * @param attempt Prisma attempt record.
 * @returns Serialized attempt payload.
 */
export function toQuizAttemptDto(attempt: QuizAttempt): QuizAttemptDto {
  return {
    id: attempt.id,
    quizId: attempt.quizId,
    userId: attempt.userId,
    status: attempt.status,
    attemptNumber: attempt.attemptNumber,
    startedAt: attempt.startedAt.toISOString(),
    submittedAt: attempt.submittedAt?.toISOString() ?? null,
    score: attempt.score,
    maxScore: attempt.maxScore,
    passed: attempt.passed,
  };
}

/**
 * Converts a Prisma attempt answer into the public API shape.
 * @param answer Prisma attempt answer record.
 * @returns Serialized answer payload.
 */
export function toAttemptAnswerDto(answer: QuizAttemptAnswerRecord): AttemptAnswerDto {
  return {
    id: answer.id,
    attemptId: answer.attemptId,
    questionId: answer.questionId,
    textAnswer: answer.textAnswer,
    isCorrect: answer.isCorrect,
    awardedPoints: answer.awardedPoints,
    feedback: answer.feedback,
    gradedAt: answer.gradedAt?.toISOString() ?? null,
    selectedOptions: answer.selectedOptions.map((option) => ({ optionId: option.optionId })),
    updatedAt: answer.updatedAt.toISOString(),
  };
}

/**
 * Converts a Prisma attempt and nested answers into the detail shape.
 * @param attempt Prisma attempt record.
 * @param answers Nested attempt answers.
 * @returns Serialized attempt detail payload.
 */
export function toAttemptDetailDto(
  attempt: QuizAttempt,
  answers: QuizAttemptAnswerRecord[],
): AttemptDetailDto {
  return {
    ...toQuizAttemptDto(attempt),
    answers: answers.map(toAttemptAnswerDto),
  };
}

/**
 * Converts graded attempt data into the public result shape.
 * @param attempt Prisma attempt record.
 * @param answers Result answer payloads.
 * @returns Serialized attempt result.
 */
export function toAttemptResultDto(
  attempt: QuizAttempt,
  answers: AttemptResultAnswerDto[],
): AttemptResultDto {
  return {
    attemptId: attempt.id,
    quizId: attempt.quizId,
    score: attempt.score,
    maxScore: attempt.maxScore,
    passed: attempt.passed,
    status: attempt.status,
    submittedAt: attempt.submittedAt?.toISOString() ?? null,
    answers,
  };
}
