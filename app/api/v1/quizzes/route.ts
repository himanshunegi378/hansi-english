import { createQuiz, jsonError, jsonSuccess, listQuizzes, readJsonBody } from "@/features/quiz/backend";

export const dynamic = "force-dynamic";

/**
 * Lists quizzes visible to the current authenticated user.
 * @param request Incoming request containing pagination query params.
 * @returns JSON response containing quiz list data.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const quizzes = await listQuizzes({
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined,
      status: searchParams.get("status") ?? undefined,
    });

    return jsonSuccess(quizzes);
  } catch (error) {
    return jsonError(error);
  }
}

/**
 * Creates a new quiz for the authenticated manager.
 * @param request Incoming JSON request containing quiz fields.
 * @returns JSON response containing the created quiz.
 */
export async function POST(request: Request) {
  try {
    const body = await readJsonBody(request);
    const quiz = await createQuiz(body);
    return jsonSuccess(quiz, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
