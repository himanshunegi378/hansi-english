import {
  QuizAttemptStatus,
  QuizQuestionType,
  QuizStatus,
  type QuizQuestionOption,
} from "@/generated/prisma/client";
import { actions, defineAbilitiesFor, subjects } from "@/lib/casl/ability";
import { requireQuizManager, requireQuizUser } from "../auth";
import { QuizError } from "../errors";
import {
  toAttemptAnswerDto,
  toAttemptDetailDto,
  toAttemptResultDto,
  toQuizAttemptDto,
} from "../mappers";
import {
  manualGradeSchema,
  saveAnswerSchema,
  startAttemptSchema,
  submitAttemptSchema,
} from "../schemas";
import * as attemptRepository from "../repositories/attempt-repository";
import * as quizRepository from "../repositories/quiz-repository";
import type {
  AttemptListResponseDto,
  ManualGradeInput,
  SaveAnswerInput,
  StartAttemptInput,
  SubmitAttemptInput,
  SubmittedAttemptDto,
} from "../types";

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function getCorrectOptionIds(options: QuizQuestionOption[]) {
  return options.filter((option) => option.isCorrect).map((option) => option.id).sort();
}

function ensureQuestionOptionIds(questionOptionIds: string[], selectedOptionIds: string[]) {
  const invalidOptionId = selectedOptionIds.find((optionId) => !questionOptionIds.includes(optionId));

  if (invalidOptionId) {
    throw new QuizError(400, "INVALID_ANSWER_PAYLOAD", "selectedOptionIds contains options that do not belong to this question");
  }
}

function calculateAttemptOutcome(
  attempt: NonNullable<Awaited<ReturnType<typeof attemptRepository.findAttemptWithQuiz>>>,
  forceSubmit: boolean,
) {
  const questions = attempt.quiz.sections.flatMap((section) => section.questions);
  const answersByQuestionId = new Map(attempt.answers.map((answer) => [answer.questionId, answer]));
  const summary = {
    totalQuestions: questions.length,
    answeredQuestions: attempt.answers.length,
    correctQuestions: attempt.answers.filter((answer) => answer.isCorrect === true).length,
    incorrectQuestions: attempt.answers.filter((answer) => answer.isCorrect === false).length,
  };

  if (!forceSubmit) {
    const unansweredRequiredQuestion = questions.find(
      (question) => question.isRequired && !answersByQuestionId.has(question.id),
    );

    if (unansweredRequiredQuestion) {
      throw new QuizError(400, "QUIZ_NOT_READY_FOR_SUBMISSION", "Attempt contains unanswered required questions");
    }
  }

  const maxScore = questions.reduce((total, question) => total + question.points, 0);
  const hasPendingManualGrade = questions.some((question) => {
    const answer = answersByQuestionId.get(question.id);
    return Boolean(answer && answer.isCorrect === null);
  });

  if (hasPendingManualGrade) {
    return {
      maxScore,
      passed: null,
      score: null,
      status: QuizAttemptStatus.SUBMITTED,
      summary,
    };
  }

  const score = attempt.answers.reduce((total, answer) => total + (answer.awardedPoints ?? 0), 0);
  const passed = attempt.quiz.passingScore === null ? null : score >= attempt.quiz.passingScore;
  const status =
    attempt.status === QuizAttemptStatus.SUBMITTED
      ? QuizAttemptStatus.MANUALLY_GRADED
      : QuizAttemptStatus.AUTO_GRADED;

  return {
    maxScore,
    passed,
    score,
    status,
    summary,
  };
}

async function refreshSubmittedAttempt(attemptId: string) {
  const attempt = await attemptRepository.findAttemptWithQuiz(attemptId);

  if (!attempt || !attempt.submittedAt) {
    return null;
  }

  const outcome = calculateAttemptOutcome(attempt, true);
  return attemptRepository.updateAttempt(attemptId, {
    status: outcome.status,
    score: outcome.score,
    maxScore: outcome.maxScore,
    passed: outcome.passed,
    submittedAt: attempt.submittedAt,
  });
}

/**
 * Starts a new attempt for the current learner or returns the requested in-progress attempt.
 * @param quizId Quiz identifier.
 * @param input Raw attempt payload.
 * @returns Serialized started attempt.
 */
export async function startAttempt(quizId: string, input: StartAttemptInput | unknown) {
  const user = await requireQuizUser();
  const result = startAttemptSchema.safeParse(input ?? {});

  if (!result.success) {
    throw new QuizError(400, "VALIDATION_ERROR", result.error.issues[0]?.message ?? "Invalid attempt payload.");
  }

  const quiz = await attemptRepository.findQuizForAttemptStart(quizId);
  if (!quiz || quiz.status !== QuizStatus.PUBLISHED) {
    throw new QuizError(404, "QUIZ_NOT_FOUND", "Quiz not found");
  }

  const existingAttempt = await attemptRepository.findInProgressAttempt(quizId, user.id);

  if (result.data.resumeAttemptId) {
    if (existingAttempt?.id === result.data.resumeAttemptId) {
      return toQuizAttemptDto(existingAttempt);
    }

    throw new QuizError(404, "ATTEMPT_NOT_FOUND", "Attempt not found");
  }

  if (existingAttempt) {
    throw new QuizError(409, "ATTEMPT_ALREADY_IN_PROGRESS", "An attempt is already in progress for this quiz");
  }

  const latestAttemptNumber = await attemptRepository.findLatestAttemptNumber(quizId, user.id);
  const maxScore = quiz.sections.reduce(
    (total, section) => total + section.questions.reduce((sectionTotal, question) => sectionTotal + question.points, 0),
    0,
  );

  const attempt = await attemptRepository.createAttempt({
    quizId,
    userId: user.id,
    maxScore,
    attemptNumber: (latestAttemptNumber ?? 0) + 1,
  });

  return toQuizAttemptDto(attempt);
}

/**
 * Loads an attempt detail view for the current learner or a quiz manager.
 * @param attemptId Attempt identifier.
 * @returns Serialized attempt detail.
 */
export async function getAttempt(attemptId: string) {
  const user = await requireQuizUser();
  const ability = defineAbilitiesFor(user.role);
  const attempt = await attemptRepository.findAttemptById(attemptId);

  if (!attempt) {
    throw new QuizError(404, "ATTEMPT_NOT_FOUND", "Attempt not found");
  }

  if (attempt.userId !== user.id && !ability.can(actions.manage, subjects.quiz)) {
    throw new QuizError(403, "FORBIDDEN", "You do not have access to this attempt");
  }

  return toAttemptDetailDto(attempt, attempt.answers);
}

/**
 * Saves or replaces the answer for one question in an in-progress attempt.
 * @param attemptId Attempt identifier.
 * @param questionId Question identifier.
 * @param input Raw answer payload.
 * @returns Serialized saved answer.
 */
export async function saveAnswer(attemptId: string, questionId: string, input: SaveAnswerInput | unknown) {
  const user = await requireQuizUser();
  const result = saveAnswerSchema.safeParse(input);

  if (!result.success) {
    throw new QuizError(400, "INVALID_ANSWER_PAYLOAD", result.error.issues[0]?.message ?? "Invalid answer payload");
  }

  const [attempt, question] = await Promise.all([
    attemptRepository.findAttemptById(attemptId),
    quizRepository.findQuestionById(questionId),
  ]);

  if (!attempt || attempt.userId !== user.id) {
    throw new QuizError(404, "ATTEMPT_NOT_FOUND", "Attempt not found");
  }

  if (attempt.status !== QuizAttemptStatus.IN_PROGRESS) {
    throw new QuizError(409, "ATTEMPT_ALREADY_SUBMITTED", "Cannot update answers for a submitted attempt");
  }

  if (!question || question.section.quiz.id !== attempt.quizId) {
    throw new QuizError(404, "QUESTION_NOT_FOUND", "Question not found");
  }

  const questionOptionIds = question.options.map((option) => option.id);
  const selectedOptionIds = [...new Set(result.data.selectedOptionIds ?? [])];
  ensureQuestionOptionIds(questionOptionIds, selectedOptionIds);

  let textAnswer: string | null = null;
  let isCorrect: boolean | null = null;
  let awardedPoints: number | null = null;

  if (question.type === QuizQuestionType.SHORT_ANSWER) {
    if (!result.data.textAnswer) {
      throw new QuizError(400, "INVALID_ANSWER_PAYLOAD", "textAnswer is required for SHORT_ANSWER question");
    }

    textAnswer = result.data.textAnswer;

    if (question.correctTextAnswer) {
      isCorrect = normalizeText(textAnswer) === normalizeText(question.correctTextAnswer);
      awardedPoints = isCorrect ? question.points : 0;
    }
  } else {
    if (selectedOptionIds.length === 0) {
      throw new QuizError(400, "INVALID_ANSWER_PAYLOAD", `selectedOptionIds is required for ${question.type} question`);
    }

    if ((question.type === QuizQuestionType.SINGLE_CHOICE || question.type === QuizQuestionType.TRUE_FALSE) && selectedOptionIds.length !== 1) {
      throw new QuizError(400, "INVALID_ANSWER_PAYLOAD", `selectedOptionIds must contain exactly one option for ${question.type} question`);
    }

    const selectedIds = [...selectedOptionIds].sort();
    const correctIds = getCorrectOptionIds(question.options);
    isCorrect = selectedIds.length === correctIds.length && selectedIds.every((optionId, index) => optionId === correctIds[index]);
    awardedPoints = isCorrect ? question.points : 0;
  }

  const answer = await attemptRepository.upsertAttemptAnswer({
    attemptId,
    questionId,
    userId: user.id,
    textAnswer,
    isCorrect,
    awardedPoints,
    feedback: null,
    selectedOptionIds,
  });

  return toAttemptAnswerDto(answer);
}

/**
 * Submits an attempt and computes grading state.
 * @param attemptId Attempt identifier.
 * @param input Raw submit payload.
 * @returns Serialized submitted attempt with summary.
 */
export async function submitAttempt(attemptId: string, input: SubmitAttemptInput | unknown): Promise<SubmittedAttemptDto> {
  const user = await requireQuizUser();
  const result = submitAttemptSchema.safeParse(input ?? {});

  if (!result.success) {
    throw new QuizError(400, "VALIDATION_ERROR", result.error.issues[0]?.message ?? "Invalid submit payload.");
  }

  const attempt = await attemptRepository.findAttemptWithQuiz(attemptId);

  if (!attempt || attempt.userId !== user.id) {
    throw new QuizError(404, "ATTEMPT_NOT_FOUND", "Attempt not found");
  }

  if (attempt.status !== QuizAttemptStatus.IN_PROGRESS) {
    throw new QuizError(409, "ATTEMPT_ALREADY_SUBMITTED", "Attempt has already been submitted");
  }

  const outcome = calculateAttemptOutcome(attempt, result.data.forceSubmit ?? false);
  const submittedAt = new Date();
  const updatedAttempt = await attemptRepository.updateAttempt(attemptId, {
    status: outcome.status,
    score: outcome.score,
    maxScore: outcome.maxScore,
    passed: outcome.passed,
    submittedAt,
  });

  return {
    ...toQuizAttemptDto(updatedAttempt),
    summary: outcome.summary,
  };
}

/**
 * Returns a graded result view for one attempt.
 * @param attemptId Attempt identifier.
 * @returns Serialized attempt result payload.
 */
export async function getAttemptResult(attemptId: string) {
  const user = await requireQuizUser();
  const ability = defineAbilitiesFor(user.role);
  const attempt = await attemptRepository.findAttemptWithQuiz(attemptId);

  if (!attempt) {
    throw new QuizError(404, "ATTEMPT_NOT_FOUND", "Attempt not found");
  }

  if (attempt.userId !== user.id && !ability.can(actions.manage, subjects.quiz)) {
    throw new QuizError(403, "FORBIDDEN", "You do not have access to this attempt");
  }

  if (attempt.status !== QuizAttemptStatus.AUTO_GRADED && attempt.status !== QuizAttemptStatus.MANUALLY_GRADED) {
    throw new QuizError(403, "RESULT_NOT_AVAILABLE", "Results are not yet available for this attempt");
  }

  const answers = attempt.answers.map((answer) => ({
    questionId: answer.questionId,
    questionText: answer.question.text,
    isCorrect: answer.isCorrect,
    awardedPoints: answer.awardedPoints,
    selectedOptionIds: answer.selectedOptions.map((option) => option.optionId),
    correctOptionIds: getCorrectOptionIds(answer.question.options),
    explanation: answer.question.explanation,
  }));

  return toAttemptResultDto(attempt, answers);
}

/**
 * Lists the current learner's attempts for a quiz.
 * @param quizId Quiz identifier.
 * @returns Serialized attempt list payload.
 */
export async function listMyAttempts(quizId: string): Promise<AttemptListResponseDto> {
  const user = await requireQuizUser();
  const quiz = await quizRepository.findQuizById(quizId);

  if (!quiz || quiz.status !== QuizStatus.PUBLISHED) {
    throw new QuizError(404, "QUIZ_NOT_FOUND", "Quiz not found");
  }

  const attempts = await attemptRepository.listAttemptsByQuizAndUser(quizId, user.id);
  return {
    items: attempts.map(toQuizAttemptDto),
  };
}

/**
 * Applies manual grading to a saved answer and refreshes attempt status when needed.
 * @param answerId Answer identifier.
 * @param input Raw manual grade payload.
 * @returns Serialized graded answer payload.
 */
export async function manualGradeAnswer(answerId: string, input: ManualGradeInput | unknown) {
  await requireQuizManager();
  const result = manualGradeSchema.safeParse(input);

  if (!result.success) {
    throw new QuizError(400, "VALIDATION_ERROR", result.error.issues[0]?.message ?? "Invalid manual grade payload.");
  }

  const answer = await attemptRepository.findAnswerById(answerId);
  if (!answer) {
    throw new QuizError(404, "ANSWER_NOT_FOUND", "Answer not found");
  }

  if (answer.attempt.status === QuizAttemptStatus.IN_PROGRESS) {
    throw new QuizError(400, "INVALID_GRADE", "Cannot manually grade an answer before the attempt is submitted");
  }

  if (result.data.awardedPoints > answer.question.points) {
    throw new QuizError(400, "INVALID_GRADE", "Awarded points cannot exceed question points");
  }

  const updatedAnswer = await attemptRepository.updateAnswerGrade(answerId, {
    isCorrect: result.data.isCorrect,
    awardedPoints: result.data.awardedPoints,
    feedback: result.data.feedback ?? null,
  });

  await refreshSubmittedAttempt(answer.attemptId);

  return {
    id: updatedAnswer.id,
    isCorrect: updatedAnswer.isCorrect,
    awardedPoints: updatedAnswer.awardedPoints,
    gradedAt: updatedAnswer.gradedAt?.toISOString() ?? null,
    feedback: updatedAnswer.feedback,
  };
}
