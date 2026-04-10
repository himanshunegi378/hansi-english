import { createSection, jsonError, jsonSuccess, readJsonBody } from "@/features/quiz/backend";

export const dynamic = "force-dynamic";

interface QuizSectionsRouteContext {
  params: Promise<{
    quizId: string;
  }>;
}

/**
 * Creates a section inside a quiz.
 * @param request Incoming JSON request containing section fields.
 * @param context Route context containing the quiz id.
 * @returns JSON response containing the created section.
 */
export async function POST(request: Request, context: QuizSectionsRouteContext) {
  try {
    const { quizId } = await context.params;
    const body = await readJsonBody(request);
    const section = await createSection(quizId, body);
    return jsonSuccess(section, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
