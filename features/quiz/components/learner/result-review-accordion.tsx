import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PassFailBadge } from "../shared/quiz-badges";
import type { QuizUiAttemptRecord } from "../../types/ui";

/**
 * Renders the per-question result review accordion.
 * @param props Attempt record with reviewed answers.
 * @returns Result accordion.
 */
export function ResultReviewAccordion({ attempt }: { attempt: QuizUiAttemptRecord }) {
  return (
    <div className="rounded-[1.75rem] border border-border/70 bg-card/85 p-5 shadow-sm sm:p-6">
      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Answer review</p>
      <Accordion defaultValue={attempt.answers[0] ? [attempt.answers[0].id] : []} className="mt-4">
        {attempt.answers.map((answer) => (
          <AccordionItem key={answer.id} value={answer.id} className="border-border/60">
            <AccordionTrigger className="gap-4 py-4">
              <div className="flex flex-1 flex-col gap-2">
                <span className="font-medium text-foreground">{answer.questionText}</span>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{answer.awardedPoints ?? 0}/{answer.maxPoints} pts</span>
                  <PassFailBadge passed={answer.isCorrect} />
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-[1.25rem] border border-border/60 bg-background/75 p-4"><p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Selected answer</p><p className="mt-2 text-sm leading-7 text-foreground/85">{answer.learnerAnswer}</p></div>
                <div className="rounded-[1.25rem] border border-border/60 bg-background/75 p-4"><p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Correct answer</p><p className="mt-2 text-sm leading-7 text-foreground/85">{answer.correctAnswer}</p></div>
              </div>
              <div className="mt-4 rounded-[1.25rem] border border-border/60 bg-background/75 p-4"><p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Explanation</p><p className="mt-2 text-sm leading-7 text-muted-foreground">{answer.explanation}</p></div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
