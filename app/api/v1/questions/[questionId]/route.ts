import { deleteQuestion, jsonError, jsonSuccess, readJsonBody, updateQuestion } from "@/features/quiz/backend";

export const dynamic = "force-dynamic";

interface QuestionRouteContext {
  params: Promise<{
    questionId: string;
  }>;
}

/**
 * Updates one question.
 * @param request Incoming JSON request containing question updates.
 * @param context Route context containing the question id.
 * @returns JSON response containing the updated question.
 */
export async function PATCH(request: Request, context: QuestionRouteContext) {
  try {
    const { questionId } = await context.params;
    const body = await readJsonBody(request);
    const question = await updateQuestion(questionId, body);
    return jsonSuccess(question);
  } catch (error) {
    return jsonError(error);
  }
}

/**
 * Deletes one question.
 * @param _request Incoming request object.
 * @param context Route context containing the question id.
 * @returns Empty `204` response on success.
 */
export async function DELETE(_request: Request, context: QuestionRouteContext) {
  try {
    const { questionId } = await context.params;
    await deleteQuestion(questionId);
    return new Response(null, { status: 204 });
  } catch (error) {
    return jsonError(error);
  }
}
