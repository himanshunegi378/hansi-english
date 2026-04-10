import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { roles } from "@/lib/auth/roles";
import { AdminAttemptReviewPage } from "@/features/quiz/pages/admin-attempt-review-page";

interface AdminAttemptReviewRouteProps {
  params: Promise<{ attemptId: string }>;
}

/**
 * Renders the admin attempt review screen.
 * @param props Dynamic route params containing the attempt id.
 * @returns The attempt review page.
 */
export default async function AdminAttemptReviewRoute({ params }: AdminAttemptReviewRouteProps) {
  const session = await auth();

  if (session?.user?.role !== roles.admin) {
    redirect("/");
  }

  const { attemptId } = await params;

  return <AdminAttemptReviewPage attemptId={attemptId} />;
}
