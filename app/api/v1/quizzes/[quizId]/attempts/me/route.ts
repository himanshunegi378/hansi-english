import { jsonError, jsonSuccess, listMyAttempts } from "@/features/quiz/backend";

export const dynamic = "force-dynamic";

interface QuizMyAttemptsRouteContext {
  params: Promise<{
    quizId: string;
  }>;
}

/**
 * Lists the current learner's attempts for one quiz.
 * @param _request Incoming request object.
 * @param context Route context containing the quiz id.
 * @returns JSON response containing attempt summaries.
 */
export async function GET(_request: Request, context: QuizMyAttemptsRouteContext) {
  try {
    const { quizId } = await context.params;
    const attempts = await listMyAttempts(quizId);
    return jsonSuccess(attempts);
  } catch (error) {
    return jsonError(error);
  }
}
