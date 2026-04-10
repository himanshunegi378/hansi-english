import { archiveQuiz, jsonError, jsonSuccess } from "@/features/quiz/backend";

export const dynamic = "force-dynamic";

interface QuizArchiveRouteContext {
  params: Promise<{
    quizId: string;
  }>;
}

/**
 * Archives one quiz.
 * @param _request Incoming request object.
 * @param context Route context containing the quiz id.
 * @returns JSON response containing the archive result.
 */
export async function POST(_request: Request, context: QuizArchiveRouteContext) {
  try {
    const { quizId } = await context.params;
    const quiz = await archiveQuiz(quizId);
    return jsonSuccess(quiz);
  } catch (error) {
    return jsonError(error);
  }
}
