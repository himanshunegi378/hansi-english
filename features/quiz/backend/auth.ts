import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { actions, defineAbilitiesFor, subjects } from "@/lib/casl/ability";
import type { AppRole } from "@/lib/auth/roles";
import { QuizError } from "./errors";

export interface QuizSessionUser {
  id: string;
  role: AppRole;
}

/**
 * Resolves the current authenticated user and role from the active session.
 * @returns The persisted user identifier and role for the current session.
 */
export async function requireQuizUser(): Promise<QuizSessionUser> {
  const session = await auth();

  if (!session?.user) {
    throw new QuizError(401, "UNAUTHORIZED", "Authentication required.");
  }

  if (session.user.id) {
    return {
      id: session.user.id,
      role: session.user.role,
    };
  }

  if (!session.user.email) {
    throw new QuizError(401, "UNAUTHORIZED", "Authentication required.");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      role: true,
    },
  });

  if (!user) {
    throw new QuizError(401, "UNAUTHORIZED", "Authentication required.");
  }

  return user;
}

/**
 * Ensures the current user can manage quizzes through the shared CASL policy.
 * @returns The authenticated quiz manager session user.
 */
export async function requireQuizManager(): Promise<QuizSessionUser> {
  const user = await requireQuizUser();
  const ability = defineAbilitiesFor(user.role);

  if (!ability.can(actions.manage, subjects.quiz)) {
    throw new QuizError(403, "FORBIDDEN", "You do not have access to modify this quiz.");
  }

  return user;
}
