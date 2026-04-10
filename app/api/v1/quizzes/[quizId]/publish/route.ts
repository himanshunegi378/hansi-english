import { jsonError, jsonSuccess, publishQuiz } from "@/features/quiz/backend";

export const dynamic = "force-dynamic";

interface QuizPublishRouteContext {
  params: Promise<{
    quizId: string;
  }>;
}

/**
 * Publishes one quiz.
 * @param _request Incoming request object.
 * @param context Route context containing the quiz id.
 * @returns JSON response containing the publish result.
 */
export async function POST(_request: Request, context: QuizPublishRouteContext) {
  try {
    const { quizId } = await context.params;
    const quiz = await publishQuiz(quizId);
    return jsonSuccess(quiz);
  } catch (error) {
    return jsonError(error);
  }
}
