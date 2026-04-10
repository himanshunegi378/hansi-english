import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { MyAttemptsPage } from "@/features/quiz/pages/my-attempts-page";

/**
 * Renders the current learner's attempt history.
 * @returns The attempt history page.
 */
export default async function MyAttemptsRoute() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <MyAttemptsPage />;
}
