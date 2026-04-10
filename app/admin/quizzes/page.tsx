import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { roles } from "@/lib/auth/roles";
import { AdminQuizListPage } from "@/features/quiz/pages/admin-quiz-list-page";

/**
 * Renders the admin quiz list for quiz managers.
 * @returns The admin quiz studio list.
 */
export default async function AdminQuizzesPage() {
  const session = await auth();

  if (session?.user?.role !== roles.admin) {
    redirect("/");
  }

  return <AdminQuizListPage />;
}
