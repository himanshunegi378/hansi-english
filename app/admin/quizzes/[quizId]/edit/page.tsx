import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { roles } from "@/lib/auth/roles";
import { AdminQuizBuilderPage } from "@/features/quiz/pages/admin-quiz-builder-page";

interface AdminQuizEditPageProps {
  params: Promise<{ quizId: string }>;
}

/**
 * Renders the admin quiz builder.
 * @param props Dynamic route params containing the quiz id.
 * @returns The builder page.
 */
export default async function AdminQuizEditPage({ params }: AdminQuizEditPageProps) {
  const session = await auth();

  if (session?.user?.role !== roles.admin) {
    redirect("/");
  }

  const { quizId } = await params;

  return <AdminQuizBuilderPage quizId={quizId} />;
}
