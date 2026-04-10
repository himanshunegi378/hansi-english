import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { QuizPageShell } from "../components/shared/quiz-page-shell";
import { QuizInstructionsCard } from "../components/learner/quiz-instructions-card";
import { getQuizRecord } from "../lib/mock-data";

/**
 * Renders the learner instructions screen before quiz start.
 * @param props Quiz identifier from the route.
 * @returns Quiz instructions page.
 */
export function QuizInstructionsPage({ quizId }: { quizId: string }) {
  const quiz = getQuizRecord(quizId);

  return (
    <QuizPageShell.Root>
      <QuizPageShell.Header>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink render={<Link href="/quizzes" />}>Quizzes</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>{quiz.title}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </QuizPageShell.Header>
      <QuizPageShell.Body>
        <QuizInstructionsCard quiz={quiz} actionHref={`/quizzes/${quiz.id}/start`} />
      </QuizPageShell.Body>
    </QuizPageShell.Root>
  );
}
