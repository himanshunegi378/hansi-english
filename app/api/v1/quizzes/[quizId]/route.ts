import { getQuiz, jsonError, jsonSuccess, readJsonBody, updateQuiz } from "@/features/quiz/backend";

export const dynamic = "force-dynamic";

interface QuizRouteContext {
  params: Promise<{
    quizId: string;
  }>;
}

/**
 * Loads one quiz visible to the current user.
 * @param _request Incoming request object.
 * @param context Route context containing the quiz id.
 * @returns JSON response containing quiz detail data.
 */
export async function GET(_request: Request, context: QuizRouteContext) {
  try {
    const { quizId } = await context.params;
    const quiz = await getQuiz(quizId);
    return jsonSuccess(quiz);
  } catch (error) {
    return jsonError(error);
  }
}

/**
 * Updates one quiz for the authenticated manager.
 * @param request Incoming JSON request containing quiz updates.
 * @param context Route context containing the quiz id.
 * @returns JSON response containing the updated quiz.
 */
export async function PATCH(request: Request, context: QuizRouteContext) {
  try {
    const { quizId } = await context.params;
    const body = await readJsonBody(request);
    const quiz = await updateQuiz(quizId, body);
    return jsonSuccess(quiz);
  } catch (error) {
    return jsonError(error);
  }
}
