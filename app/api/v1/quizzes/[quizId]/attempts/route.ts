import { jsonError, jsonSuccess, readOptionalJsonBody, startAttempt } from "@/features/quiz/backend";

export const dynamic = "force-dynamic";

interface QuizAttemptsRouteContext {
  params: Promise<{
    quizId: string;
  }>;
}

/**
 * Starts a new attempt for the current learner.
 * @param request Incoming JSON request containing optional resume data.
 * @param context Route context containing the quiz id.
 * @returns JSON response containing the created attempt.
 */
export async function POST(request: Request, context: QuizAttemptsRouteContext) {
  try {
    const { quizId } = await context.params;
    const body = await readOptionalJsonBody(request);
    const attempt = await startAttempt(quizId, body);
    return jsonSuccess(attempt, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
