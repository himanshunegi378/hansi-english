"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

/**
 * Resolves the current authenticated user id when available.
 * @returns The user id, or null for anonymous visitors.
 */
export async function getOptionalUserId(): Promise<string | null> {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  if (session.user.id) {
    return session.user.id;
  }

  if (!session.user.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
    },
  });

  return user?.id ?? null;
}

/**
 * Ensures the active visitor is authenticated before a progress mutation.
 * @returns The persisted user id for the active session.
 */
export async function requireAuthenticatedUserId(): Promise<string> {
  const userId = await getOptionalUserId();

  if (!userId) {
    throw new Error("Please sign in to save story progress.");
  }

  return userId;
}
