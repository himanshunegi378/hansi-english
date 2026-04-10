import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { QuizAttemptPage } from "@/features/quiz/pages/quiz-attempt-page";

interface QuizStartRouteProps {
  params: Promise<{ quizId: string }>;
}

/**
 * Renders the learner quiz attempt screen for authenticated users.
 * @param props Dynamic route params containing the quiz id.
 * @returns The attempt page.
 */
export default async function QuizStartRoute({ params }: QuizStartRouteProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { quizId } = await params;

  return <QuizAttemptPage quizId={quizId} />;
}
