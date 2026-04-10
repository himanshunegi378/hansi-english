import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { roles } from "@/lib/auth/roles";
import { AdminQuizCreatePage } from "@/features/quiz/pages/admin-quiz-create-page";

/**
 * Renders the admin create-quiz screen for quiz managers.
 * @returns The quiz creation page.
 */
export default async function AdminNewQuizPage() {
  const session = await auth();

  if (session?.user?.role !== roles.admin) {
    redirect("/");
  }

  return <AdminQuizCreatePage />;
}
