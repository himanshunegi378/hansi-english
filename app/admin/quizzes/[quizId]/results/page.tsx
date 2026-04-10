import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { roles } from "@/lib/auth/roles";
import { AdminQuizResultsPage } from "@/features/quiz/pages/admin-quiz-results-page";

interface AdminQuizResultsRouteProps {
  params: Promise<{ quizId: string }>;
}

/**
 * Renders the admin quiz results overview.
 * @param props Dynamic route params containing the quiz id.
 * @returns The results overview page.
 */
export default async function AdminQuizResultsRoute({ params }: AdminQuizResultsRouteProps) {
  const session = await auth();

  if (session?.user?.role !== roles.admin) {
    redirect("/");
  }

  const { quizId } = await params;

  return <AdminQuizResultsPage quizId={quizId} />;
}
