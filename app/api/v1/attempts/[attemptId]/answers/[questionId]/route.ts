import { jsonError, jsonSuccess, readJsonBody, saveAnswer } from "@/features/quiz/backend";

export const dynamic = "force-dynamic";

interface AttemptAnswerRouteContext {
  params: Promise<{
    attemptId: string;
    questionId: string;
  }>;
}

/**
 * Replaces the saved answer for one question in an attempt.
 * @param request Incoming JSON request containing answer data.
 * @param context Route context containing the attempt and question ids.
 * @returns JSON response containing the saved answer.
 */
export async function PUT(request: Request, context: AttemptAnswerRouteContext) {
  try {
    const { attemptId, questionId } = await context.params;
    const body = await readJsonBody(request);
    const answer = await saveAnswer(attemptId, questionId, body);
    return jsonSuccess(answer);
  } catch (error) {
    return jsonError(error);
  }
}
