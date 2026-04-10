import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { QuizSubmissionPage } from "@/features/quiz/pages/quiz-submission-page";

interface AttemptSubmissionRouteProps {
  params: Promise<{ attemptId: string }>;
}

/**
 * Renders the submission-success page for an authenticated learner.
 * @param props Dynamic route params containing the attempt id.
 * @returns The submission confirmation page.
 */
export default async function AttemptSubmissionRoute({ params }: AttemptSubmissionRouteProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { attemptId } = await params;

  return <QuizSubmissionPage attemptId={attemptId} />;
}
