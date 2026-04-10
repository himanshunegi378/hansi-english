import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { roles } from "@/lib/auth/roles";
import { AdminQuizPreviewPage } from "@/features/quiz/pages/admin-quiz-preview-page";

interface AdminQuizPreviewRouteProps {
  params: Promise<{ quizId: string }>;
}

/**
 * Renders the admin learner-view quiz preview.
 * @param props Dynamic route params containing the quiz id.
 * @returns The preview page.
 */
export default async function AdminQuizPreviewRoute({ params }: AdminQuizPreviewRouteProps) {
  const session = await auth();

  if (session?.user?.role !== roles.admin) {
    redirect("/");
  }

  const { quizId } = await params;

  return <AdminQuizPreviewPage quizId={quizId} />;
}
