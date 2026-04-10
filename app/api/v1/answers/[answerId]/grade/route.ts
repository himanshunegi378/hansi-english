import { jsonError, jsonSuccess, manualGradeAnswer, readJsonBody } from "@/features/quiz/backend";

export const dynamic = "force-dynamic";

interface AnswerGradeRouteContext {
  params: Promise<{
    answerId: string;
  }>;
}

/**
 * Applies manual grading to one saved answer.
 * @param request Incoming JSON request containing manual grading data.
 * @param context Route context containing the answer id.
 * @returns JSON response containing the updated grading fields.
 */
export async function PATCH(request: Request, context: AnswerGradeRouteContext) {
  try {
    const { answerId } = await context.params;
    const body = await readJsonBody(request);
    const answer = await manualGradeAnswer(answerId, body);
    return jsonSuccess(answer);
  } catch (error) {
    return jsonError(error);
  }
}
