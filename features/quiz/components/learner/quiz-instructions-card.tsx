import { AlertTriangle, Clock3, Layers3, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { QuizUiRecord } from "../../types/ui";

interface QuizInstructionsCardProps {
  actionHref: string;
  quiz: QuizUiRecord;
}

/**
 * Renders the pre-start instructions panel for learners.
 * @param props Quiz data and start destination.
 * @returns Quiz instruction card.
 */
export function QuizInstructionsCard({ actionHref, quiz }: QuizInstructionsCardProps) {
  return (
    <Card className="rounded-[2rem] border-border/70 bg-card/90 shadow-sm">
      <CardHeader className="gap-4 border-b border-border/60 bg-secondary/20 p-5 sm:p-8">
        <CardTitle className="font-heading text-4xl tracking-tight sm:text-5xl">{quiz.title}</CardTitle>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground">{quiz.description}</p>
      </CardHeader>
      <CardContent className="grid gap-6 p-5 sm:p-8 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.5rem] border border-border/60 bg-background/75 p-4"><Clock3 className="text-muted-foreground" /><p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">Time limit</p><p className="mt-2 font-heading text-3xl">{quiz.timeLimitMin} min</p></div>
          <div className="rounded-[1.5rem] border border-border/60 bg-background/75 p-4"><Layers3 className="text-muted-foreground" /><p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">Questions</p><p className="mt-2 font-heading text-3xl">{quiz.questionCount}</p></div>
          <div className="rounded-[1.5rem] border border-border/60 bg-background/75 p-4"><Target className="text-muted-foreground" /><p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">Passing score</p><p className="mt-2 font-heading text-3xl">{quiz.passingScore}%</p></div>
        </div>

        <div className="rounded-[1.75rem] border border-border/60 bg-background/75 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Rules and rhythm</p>
          <div className="mt-4 flex flex-col gap-3 text-sm leading-7 text-muted-foreground">
            <p>Move steadily. The timer is there to protect focus, not to punish careful thinking.</p>
            <p>Save answers as you go, and mark anything uncertain for review before submitting.</p>
            <p>Short-answer prompts may enter manual review when wording is close but not exact.</p>
          </div>
          <div className="mt-5 flex items-start gap-3 rounded-[1.25rem] border border-border/60 bg-secondary/45 p-4 text-sm leading-6 text-foreground/85">
            <AlertTriangle className="mt-0.5 shrink-0 text-muted-foreground" />
            The quiz will auto-submit if the timer expires while you are still in progress.
          </div>
          <Button className="mt-5 w-full rounded-full" render={<a href={actionHref} />} nativeButton={false}>Start quiz</Button>
        </div>
      </CardContent>
    </Card>
  );
}
