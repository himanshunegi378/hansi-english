import prisma from "@/lib/prisma";

/**
 * Loads quiz data needed before starting an attempt.
 * @param quizId Quiz identifier.
 * @returns Quiz record with nested question points, or null when missing.
 */
export async function findQuizForAttemptStart(quizId: string) {
  return prisma.quiz.findUnique({
    where: {
      id: quizId,
    },
    include: {
      sections: {
        include: {
          questions: {
            select: {
              id: true,
              points: true,
            },
          },
        },
      },
    },
  });
}

/**
 * Loads the active in-progress attempt for a quiz and user when present.
 * @param quizId Quiz identifier.
 * @param userId User identifier.
 * @returns In-progress attempt or null.
 */
export async function findInProgressAttempt(quizId: string, userId: string) {
  return prisma.quizAttempt.findFirst({
    where: {
      quizId,
      userId,
      status: "IN_PROGRESS",
    },
    orderBy: {
      startedAt: "desc",
    },
  });
}

/**
 * Returns the latest attempt number for a quiz and user.
 * @param quizId Quiz identifier.
 * @param userId User identifier.
 * @returns Highest attempt number, or null when no attempts exist.
 */
export async function findLatestAttemptNumber(quizId: string, userId: string) {
  const latestAttempt = await prisma.quizAttempt.findFirst({
    where: {
      quizId,
      userId,
    },
    orderBy: {
      attemptNumber: "desc",
    },
    select: {
      attemptNumber: true,
    },
  });

  return latestAttempt?.attemptNumber ?? null;
}

/**
 * Creates a new attempt for the quiz and user.
 * @param input Attempt persistence payload.
 * @returns Newly created attempt record.
 */
export async function createAttempt(input: {
  attemptNumber: number;
  maxScore: number;
  quizId: string;
  userId: string;
}) {
  return prisma.quizAttempt.create({
    data: input,
  });
}

/**
 * Loads one attempt with nested answers for detail views.
 * @param attemptId Attempt identifier.
 * @returns Attempt record with answers or null when missing.
 */
export async function findAttemptById(attemptId: string) {
  return prisma.quizAttempt.findUnique({
    where: {
      id: attemptId,
    },
    include: {
      answers: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          selectedOptions: {
            select: {
              optionId: true,
            },
          },
        },
      },
    },
  });
}

/**
 * Loads one attempt with nested quiz/question data for grading and result views.
 * @param attemptId Attempt identifier.
 * @returns Attempt record with quiz structure and answers or null.
 */
export async function findAttemptWithQuiz(attemptId: string) {
  return prisma.quizAttempt.findUnique({
    where: {
      id: attemptId,
    },
    include: {
      answers: {
        include: {
          selectedOptions: {
            select: {
              optionId: true,
            },
          },
          question: {
            include: {
              options: {
                orderBy: {
                  order: "asc",
                },
              },
            },
          },
        },
      },
      quiz: {
        include: {
          sections: {
            orderBy: {
              order: "asc",
            },
            include: {
              questions: {
                orderBy: {
                  order: "asc",
                },
                include: {
                  options: {
                    orderBy: {
                      order: "asc",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

/**
 * Replaces the saved answer for one attempt question.
 * @param input Answer persistence payload.
 * @returns The upserted answer with selected options.
 */
export async function upsertAttemptAnswer(input: {
  attemptId: string;
  awardedPoints: number | null;
  feedback: string | null;
  isCorrect: boolean | null;
  questionId: string;
  selectedOptionIds: string[];
  textAnswer: string | null;
  userId: string;
}) {
  return prisma.$transaction(async (tx) => {
    const answer = await tx.quizAttemptAnswer.upsert({
      where: {
        attemptId_questionId: {
          attemptId: input.attemptId,
          questionId: input.questionId,
        },
      },
      update: {
        userId: input.userId,
        textAnswer: input.textAnswer,
        isCorrect: input.isCorrect,
        awardedPoints: input.awardedPoints,
        feedback: input.feedback,
        gradedAt: input.isCorrect === null ? null : new Date(),
      },
      create: {
        attemptId: input.attemptId,
        questionId: input.questionId,
        userId: input.userId,
        textAnswer: input.textAnswer,
        isCorrect: input.isCorrect,
        awardedPoints: input.awardedPoints,
        feedback: input.feedback,
        gradedAt: input.isCorrect === null ? null : new Date(),
      },
      select: {
        id: true,
      },
    });

    await tx.quizAttemptAnswerOption.deleteMany({
      where: {
        answerId: answer.id,
      },
    });

    if (input.selectedOptionIds.length > 0) {
      await tx.quizAttemptAnswerOption.createMany({
        data: input.selectedOptionIds.map((optionId) => ({
          answerId: answer.id,
          optionId,
        })),
      });
    }

    return tx.quizAttemptAnswer.findUniqueOrThrow({
      where: {
        id: answer.id,
      },
      include: {
        selectedOptions: {
          select: {
            optionId: true,
          },
        },
      },
    });
  });
}

/**
 * Updates attempt submission state and aggregate grading values.
 * @param attemptId Attempt identifier.
 * @param data Submission update payload.
 * @returns Updated attempt record.
 */
export async function updateAttempt(attemptId: string, data: {
  maxScore?: number | null;
  passed?: boolean | null;
  score?: number | null;
  status: "AUTO_GRADED" | "MANUALLY_GRADED" | "SUBMITTED";
  submittedAt?: Date | null;
}) {
  return prisma.quizAttempt.update({
    where: {
      id: attemptId,
    },
    data,
  });
}

/**
 * Lists attempts for one quiz and learner.
 * @param quizId Quiz identifier.
 * @param userId User identifier.
 * @returns Attempts sorted by newest attempt number first.
 */
export async function listAttemptsByQuizAndUser(quizId: string, userId: string) {
  return prisma.quizAttempt.findMany({
    where: {
      quizId,
      userId,
    },
    orderBy: {
      attemptNumber: "desc",
    },
  });
}

/**
 * Loads one answer with attempt and question context for manual grading.
 * @param answerId Answer identifier.
 * @returns Answer record or null when missing.
 */
export async function findAnswerById(answerId: string) {
  return prisma.quizAttemptAnswer.findUnique({
    where: {
      id: answerId,
    },
    include: {
      selectedOptions: {
        select: {
          optionId: true,
        },
      },
      question: {
        include: {
          options: {
            orderBy: {
              order: "asc",
            },
          },
        },
      },
      attempt: true,
    },
  });
}

/**
 * Applies manual grading to an answer.
 * @param answerId Answer identifier.
 * @param data Manual grade payload.
 * @returns Updated answer with selected options.
 */
export async function updateAnswerGrade(answerId: string, data: {
  awardedPoints: number;
  feedback: string | null;
  isCorrect: boolean;
}) {
  return prisma.quizAttemptAnswer.update({
    where: {
      id: answerId,
    },
    data: {
      isCorrect: data.isCorrect,
      awardedPoints: data.awardedPoints,
      feedback: data.feedback,
      gradedAt: new Date(),
    },
    include: {
      selectedOptions: {
        select: {
          optionId: true,
        },
      },
    },
  });
}
