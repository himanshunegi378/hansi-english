import { QuizInstructionsPage } from "@/features/quiz/pages/quiz-instructions-page";

interface QuizInstructionsRouteProps {
  params: Promise<{ quizId: string }>;
}

/**
 * Renders the learner quiz instructions page.
 * @param props Dynamic route params containing the quiz id.
 * @returns The quiz instructions page.
 */
export default async function QuizInstructionsRoute({ params }: QuizInstructionsRouteProps) {
  const { quizId } = await params;

  return <QuizInstructionsPage quizId={quizId} />;
}
