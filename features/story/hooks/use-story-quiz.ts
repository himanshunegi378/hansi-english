"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { submitStoryAnswerAction } from "../actions/story-attempts";
import type {
  GeneratedQuestion,
  StoryAnswerValue,
  StoryProgress,
  StoryQuestionAnswer,
} from "../types";

interface UseStoryQuizOptions {
  canSaveProgress: boolean;
  initialProgress?: StoryProgress | null;
  questions: GeneratedQuestion[];
  storyId: string;
}

/**
 * Manages draft answers, persisted progress, and grading flow for the story quiz.
 * @param options The question list, story id, and optional saved progress.
 * @returns The current quiz state and interaction handlers.
 */
export function useStoryQuiz({
  canSaveProgress,
  initialProgress,
  questions,
  storyId,
}: UseStoryQuizOptions) {
  const [progress, setProgress] = useState<StoryProgress | null>(initialProgress ?? null);
  const [localAnswers, setLocalAnswers] = useState<Record<string, StoryQuestionAnswer>>({});
  const [draftAnswers, setDraftAnswers] = useState<Record<string, StoryAnswerValue>>(
    () => createDraftAnswerMap(initialProgress),
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() =>
    getInitialQuestionIndex(questions, initialProgress?.answers ?? []),
  );
  const [isPending, startTransition] = useTransition();

  const savedAnswerMap = createSavedAnswerMap(progress, localAnswers);
  const currentQuestion = questions[currentQuestionIndex];
  const currentDraft = draftAnswers[currentQuestion.id];
  const currentSavedAnswer = savedAnswerMap[currentQuestion.id];
  const answeredCount = Object.keys(savedAnswerMap).length;
  const totalQuestions = questions.length;
  const completionPercent =
    totalQuestions === 0 ? 0 : Math.round((answeredCount / totalQuestions) * 100);

  function setOptionAnswer(questionId: string, selectedOption: string) {
    setDraftAnswers((current) => ({
      ...current,
      [questionId]: {
        valueType: "OPTION",
        selectedOption,
      },
    }));
  }

  function setTextAnswer(questionId: string, textAnswer: string) {
    setDraftAnswers((current) => ({
      ...current,
      [questionId]: {
        valueType: "TEXT",
        textAnswer,
      },
    }));
  }

  function setBooleanAnswer(questionId: string, booleanAnswer: boolean) {
    setDraftAnswers((current) => ({
      ...current,
      [questionId]: {
        valueType: "BOOLEAN",
        booleanAnswer,
      },
    }));
  }

  function goToNextQuestion() {
    setCurrentQuestionIndex((current) =>
      current < questions.length - 1 ? current + 1 : current,
    );
  }

  function goToQuestion(index: number) {
    setCurrentQuestionIndex(index);
  }

  function submitCurrentAnswer() {
    const draft = draftAnswers[currentQuestion.id];

    if (!draft || !hasAnswerValue(draft)) {
      toast.error("Please answer the question first.");
      return;
    }

    if (!canSaveProgress) {
      setLocalAnswers((current) => ({
        ...current,
        [currentQuestion.id]: gradeAnswerLocally(currentQuestion, draft),
      }));
      return;
    }

    startTransition(async () => {
      try {
        const result = await submitStoryAnswerAction({
          storyId,
          questionId: currentQuestion.id,
          valueType: draft.valueType,
          selectedOption: draft.selectedOption ?? null,
          textAnswer: draft.textAnswer?.trim() ?? null,
          booleanAnswer: draft.booleanAnswer ?? null,
        });

        setProgress(result.progress);
        setDraftAnswers((current) => ({
          ...current,
          [currentQuestion.id]: {
            valueType: result.answer.valueType,
            selectedOption: result.answer.selectedOption,
            textAnswer: result.answer.textAnswer,
            booleanAnswer: result.answer.booleanAnswer,
          },
        }));
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to save your answer. Please try again.",
        );
      }
    });
  }

  return {
    answeredCount,
    canSaveProgress,
    completionPercent,
    currentDraft,
    currentQuestion,
    currentQuestionIndex,
    currentSavedAnswer,
    draftAnswers,
    goToNextQuestion,
    goToQuestion,
    isPending,
    progress,
    savedAnswerMap,
    setBooleanAnswer,
    setOptionAnswer,
    setTextAnswer,
    submitCurrentAnswer,
    totalQuestions,
  };
}

/**
 * Builds the initial draft answer map from previously saved story progress.
 * @param progress The saved story progress for the viewer.
 * @returns A mutable draft map keyed by question id.
 */
function createDraftAnswerMap(
  progress: StoryProgress | null | undefined,
): Record<string, StoryAnswerValue> {
  const answers = progress?.answers ?? [];

  return Object.fromEntries(
    answers.map((answer) => [
      answer.questionId,
      {
        valueType: answer.valueType,
        selectedOption: answer.selectedOption,
        textAnswer: answer.textAnswer,
        booleanAnswer: answer.booleanAnswer,
      },
    ]),
  );
}

/**
 * Chooses the first unanswered question as the initial active question.
 * @param questions The ordered story questions.
 * @param answers The previously saved answers.
 * @returns The initial active question index.
 */
function getInitialQuestionIndex(
  questions: GeneratedQuestion[],
  answers: StoryQuestionAnswer[],
): number {
  const answeredIds = new Set(answers.map((answer) => answer.questionId));
  const firstUnansweredIndex = questions.findIndex(
    (question) => !answeredIds.has(question.id),
  );

  return firstUnansweredIndex >= 0 ? firstUnansweredIndex : 0;
}

/**
 * Produces one merged answer map for persisted and local-only quiz states.
 * @param progress The saved progress for authenticated users.
 * @param localAnswers The in-memory fallback answers.
 * @returns A question-id keyed answer map.
 */
function createSavedAnswerMap(
  progress: StoryProgress | null,
  localAnswers: Record<string, StoryQuestionAnswer>,
): Record<string, StoryQuestionAnswer> {
  const persistedEntries =
    progress?.answers.map((answer) => [answer.questionId, answer] as const) ?? [];

  return {
    ...Object.fromEntries(persistedEntries),
    ...localAnswers,
  };
}

/**
 * Checks whether a draft contains an actual learner response.
 * @param value The current draft answer.
 * @returns Whether the answer can be submitted.
 */
function hasAnswerValue(value: StoryAnswerValue): boolean {
  if (value.valueType === "OPTION") {
    return Boolean(value.selectedOption);
  }

  if (value.valueType === "BOOLEAN") {
    return typeof value.booleanAnswer === "boolean";
  }

  return Boolean(value.textAnswer?.trim());
}

/**
 * Grades an answer locally for anonymous visitors without saved progress.
 * @param question The active story question.
 * @param draft The current draft answer.
 * @returns The locally evaluated answer payload.
 */
function gradeAnswerLocally(
  question: GeneratedQuestion,
  draft: StoryAnswerValue,
): StoryQuestionAnswer {
  if (draft.valueType === "OPTION") {
    const isCorrect = draft.selectedOption === question.correctAnswer;

    return {
      questionId: question.id,
      valueType: "OPTION",
      selectedOption: draft.selectedOption ?? null,
      isCorrect,
      pointsEarned: isCorrect ? 10 : 0,
      feedback: isCorrect ? "Correct answer." : "Not quite. Review the story and try again.",
    };
  }

  return {
    questionId: question.id,
    valueType: draft.valueType,
    textAnswer: draft.textAnswer ?? null,
    booleanAnswer: draft.booleanAnswer ?? null,
    isCorrect: false,
    pointsEarned: 0,
    feedback: "Sign in to save progress and get scored feedback for this answer.",
  };
}
