import type { StoryProgress, StoryQuestionAnswer } from "./types";

interface DatabaseStoryProgress {
  id: string;
  earnedPoints: number;
  totalPoints: number;
  completedAt: Date | null;
  lastAnsweredAt: Date | null;
  answers?: Array<{
    questionId: string;
    valueType: "OPTION" | "TEXT" | "BOOLEAN";
    selectedOption: string | null;
    textAnswer: string | null;
    booleanAnswer: boolean | null;
    isCorrect: boolean;
    pointsEarned: number;
    feedback: string | null;
  }>;
}

/**
 * Maps a Prisma story progress row into the client-facing progress shape.
 * @param progress The persisted story progress row with answers.
 * @returns The normalized progress payload.
 */
export function mapStoryProgress(
  progress: DatabaseStoryProgress | null,
): StoryProgress | null {
  if (!progress) {
    return null;
  }

  const answers: StoryQuestionAnswer[] = (progress.answers ?? []).map((answer) => ({
    questionId: answer.questionId,
    valueType: answer.valueType,
    selectedOption: answer.selectedOption,
    textAnswer: answer.textAnswer,
    booleanAnswer: answer.booleanAnswer,
    isCorrect: answer.isCorrect,
    pointsEarned: answer.pointsEarned,
    feedback: answer.feedback,
  }));

  return {
    id: progress.id,
    earnedPoints: progress.earnedPoints,
    totalPoints: progress.totalPoints,
    completedAt: progress.completedAt?.toISOString() ?? null,
    lastAnsweredAt: progress.lastAnsweredAt?.toISOString() ?? null,
    answers,
  };
}
