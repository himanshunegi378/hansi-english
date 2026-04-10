import { jsonError, jsonSuccess, readOptionalJsonBody, submitAttempt } from "@/features/quiz/backend";

export const dynamic = "force-dynamic";

interface AttemptSubmitRouteContext {
  params: Promise<{
    attemptId: string;
  }>;
}

/**
 * Submits one quiz attempt for grading.
 * @param request Incoming JSON request containing optional submit flags.
 * @param context Route context containing the attempt id.
 * @returns JSON response containing the submitted attempt.
 */
export async function POST(request: Request, context: AttemptSubmitRouteContext) {
  try {
    const { attemptId } = await context.params;
    const body = await readOptionalJsonBody(request);
    const attempt = await submitAttempt(attemptId, body);
    return jsonSuccess(attempt);
  } catch (error) {
    return jsonError(error);
  }
}
