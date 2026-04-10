import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { QuizCard } from "../components/shared/quiz-card";
import { QuizPageIntro } from "../components/shared/quiz-page-intro";
import { QuizPageShell } from "../components/shared/quiz-page-shell";
import { getQuizLibrary } from "../lib/mock-data";

/**
 * Renders the learner quiz catalog screen.
 * @returns The quiz catalog page.
 */
export function QuizCatalogPage() {
  const quizzes = getQuizLibrary().filter((quiz) => quiz.status === "PUBLISHED");

  return (
    <QuizPageShell.Root>
      <QuizPageShell.Header>
        <QuizPageIntro
          eyebrow="Learner / Quizzes"
          title="Choose the next checkpoint in your English rhythm."
          description="Each quiz is presented as a warm destination instead of a cold assignment, with just enough structure to help you judge effort, pacing, and confidence before you begin."
          meta={
            <>
              <Badge variant="outline" className="rounded-full bg-background/70 px-3 py-1">Available</Badge>
              <Badge variant="outline" className="rounded-full bg-background/70 px-3 py-1">In progress</Badge>
              <Badge variant="outline" className="rounded-full bg-background/70 px-3 py-1">Completed</Badge>
            </>
          }
        />
      </QuizPageShell.Header>
      <QuizPageShell.Body>
        <div className="grid gap-4 lg:grid-cols-2">
          {quizzes.map((quiz, index) => (
            <QuizCard key={quiz.id} quiz={quiz} index={index} href={`/quizzes/${quiz.id}`} action="Start or resume" />
          ))}
        </div>
        <Link href="/my-attempts" className="self-start rounded-full border border-border/60 bg-card/80 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-background">View my attempts</Link>
      </QuizPageShell.Body>
    </QuizPageShell.Root>
  );
}
