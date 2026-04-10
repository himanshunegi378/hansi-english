import type { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import type {
  CreateQuestionInput,
  CreateQuizInput,
  CreateSectionInput,
  QuizListFilters,
  UpdateQuestionInput,
  UpdateQuizInput,
} from "../types";

const quizDetailInclude = {
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
} satisfies Prisma.QuizInclude;

/**
 * Lists quizzes for the provided filter and pagination inputs.
 * @param filters Pagination and status filters.
 * @param where Prisma where clause for visibility rules.
 * @returns Paginated quiz records and total count.
 */
export async function listQuizzes(filters: QuizListFilters, where: Prisma.QuizWhereInput) {
  const skip = (filters.page - 1) * filters.pageSize;

  const [items, total] = await prisma.$transaction([
    prisma.quiz.findMany({
      where,
      orderBy: {
        updatedAt: "desc",
      },
      skip,
      take: filters.pageSize,
    }),
    prisma.quiz.count({ where }),
  ]);

  return { items, total };
}

/**
 * Loads a single quiz with its nested sections, questions, and options.
 * @param quizId Quiz identifier.
 * @returns Quiz detail record or null when missing.
 */
export async function findQuizById(quizId: string) {
  return prisma.quiz.findUnique({
    where: {
      id: quizId,
    },
    include: quizDetailInclude,
  });
}

/**
 * Loads a minimal quiz record with counts for management actions.
 * @param quizId Quiz identifier.
 * @returns Quiz record with question count or null when missing.
 */
export async function findQuizForManagement(quizId: string) {
  return prisma.quiz.findUnique({
    where: {
      id: quizId,
    },
    select: {
      id: true,
      status: true,
      createdById: true,
      updatedAt: true,
      _count: {
        select: {
          sections: true,
          attempts: true,
        },
      },
      sections: {
        select: {
          _count: {
            select: {
              questions: true,
            },
          },
        },
      },
    },
  });
}

/**
 * Creates a quiz for the provided creator.
 * @param createdById Authenticated creator id.
 * @param data Quiz creation payload.
 * @returns Newly created quiz record.
 */
export async function createQuiz(createdById: string, data: CreateQuizInput) {
  return prisma.quiz.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      status: data.status,
      timeLimitMin: data.timeLimitMin ?? null,
      passingScore: data.passingScore ?? null,
      createdById,
    },
  });
}

/**
 * Updates a quiz.
 * @param quizId Quiz identifier.
 * @param data Quiz update payload.
 * @returns Updated quiz record.
 */
export async function updateQuiz(quizId: string, data: UpdateQuizInput) {
  return prisma.quiz.update({
    where: {
      id: quizId,
    },
    data: {
      ...data,
      description: data.description === undefined ? undefined : data.description,
      timeLimitMin: data.timeLimitMin === undefined ? undefined : data.timeLimitMin,
      passingScore: data.passingScore === undefined ? undefined : data.passingScore,
    },
  });
}

/**
 * Creates a section inside a quiz.
 * @param quizId Quiz identifier.
 * @param data Section creation payload.
 * @returns Newly created section.
 */
export async function createSection(quizId: string, data: CreateSectionInput) {
  return prisma.quizSection.create({
    data: {
      quizId,
      title: data.title,
      description: data.description ?? null,
      order: data.order,
    },
  });
}

/**
 * Loads a single section with parent quiz metadata.
 * @param sectionId Section identifier.
 * @returns Section record or null when missing.
 */
export async function findSectionById(sectionId: string) {
  return prisma.quizSection.findUnique({
    where: {
      id: sectionId,
    },
    include: {
      quiz: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  });
}

/**
 * Creates a question inside a section with nested options when provided.
 * @param sectionId Section identifier.
 * @param data Question creation payload.
 * @returns Newly created question with options.
 */
export async function createQuestion(sectionId: string, data: CreateQuestionInput) {
  return prisma.quizQuestion.create({
    data: {
      sectionId,
      text: data.text,
      explanation: data.explanation ?? null,
      type: data.type,
      order: data.order,
      points: data.points,
      isRequired: data.isRequired,
      correctTextAnswer: data.correctTextAnswer ?? null,
      options: data.options
        ? {
            create: data.options.map((option) => ({
              text: option.text,
              order: option.order,
              isCorrect: option.isCorrect,
            })),
          }
        : undefined,
    },
    include: {
      options: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });
}

/**
 * Loads a question with its parent quiz metadata and options.
 * @param questionId Question identifier.
 * @returns Question record or null when missing.
 */
export async function findQuestionById(questionId: string) {
  return prisma.quizQuestion.findUnique({
    where: {
      id: questionId,
    },
    include: {
      options: {
        orderBy: {
          order: "asc",
        },
      },
      section: {
        include: {
          quiz: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      },
    },
  });
}

/**
 * Updates a question and returns the fresh record with options.
 * @param questionId Question identifier.
 * @param data Question update payload.
 * @returns Updated question with options.
 */
export async function updateQuestion(questionId: string, data: UpdateQuestionInput) {
  return prisma.quizQuestion.update({
    where: {
      id: questionId,
    },
    data,
    include: {
      options: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });
}

/**
 * Deletes a question.
 * @param questionId Question identifier.
 * @returns Deleted question record.
 */
export async function deleteQuestion(questionId: string) {
  return prisma.quizQuestion.delete({
    where: {
      id: questionId,
    },
  });
}
