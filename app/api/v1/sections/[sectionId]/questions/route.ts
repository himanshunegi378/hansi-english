import { createQuestion, jsonError, jsonSuccess, readJsonBody } from "@/features/quiz/backend";

export const dynamic = "force-dynamic";

interface SectionQuestionsRouteContext {
  params: Promise<{
    sectionId: string;
  }>;
}

/**
 * Creates a question inside a section.
 * @param request Incoming JSON request containing question fields.
 * @param context Route context containing the section id.
 * @returns JSON response containing the created question.
 */
export async function POST(request: Request, context: SectionQuestionsRouteContext) {
  try {
    const { sectionId } = await context.params;
    const body = await readJsonBody(request);
    const question = await createQuestion(sectionId, body);
    return jsonSuccess(question, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
