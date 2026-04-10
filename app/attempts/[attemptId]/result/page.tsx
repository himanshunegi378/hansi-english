import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { QuizResultPage } from "@/features/quiz/pages/quiz-result-page";

interface AttemptResultRouteProps {
  params: Promise<{ attemptId: string }>;
}

/**
 * Renders the learner result page for one attempt.
 * @param props Dynamic route params containing the attempt id.
 * @returns The result page.
 */
export default async function AttemptResultRoute({ params }: AttemptResultRouteProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { attemptId } = await params;

  return <QuizResultPage attemptId={attemptId} />;
}
