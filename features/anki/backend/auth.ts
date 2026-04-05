import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { AnkiError } from "./errors";

/**
 * Resolves the current authenticated user id from the active session.
 * @returns The persisted user identifier for the current session.
 */
export async function requireAnkiUserId(): Promise<string> {
  const session = await auth();

  if (!session?.user) {
    throw new AnkiError(401, "UNAUTHORIZED", "Please sign in to use the Anki API.");
  }

  if (session.user.id) {
    return session.user.id;
  }

  if (!session.user.email) {
    throw new AnkiError(401, "UNAUTHORIZED", "Please sign in to use the Anki API.");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new AnkiError(401, "UNAUTHORIZED", "Please sign in to use the Anki API.");
  }

  return user.id;
}
