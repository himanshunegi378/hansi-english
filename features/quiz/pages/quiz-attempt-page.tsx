"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { QuizPageShell } from "../components/shared/quiz-page-shell";
import { QuizAttemptHeader } from "../components/learner/quiz-attempt-header";
import { QuizQuestionCard } from "../components/learner/quiz-question-card";
import { QuizQuestionPalette } from "../components/learner/quiz-question-palette";
import { getQuizRecord } from "../lib/mock-data";

/**
 * Renders the active quiz attempt screen with local UI state.
 * @param props Quiz identifier from the route.
 * @returns Interactive attempt surface.
 */
export function QuizAttemptPage({ quizId }: { quizId: string }) {
  const router = useRouter();
  const quiz = getQuizRecord(quizId);
  const questions = quiz.sections.flatMap((section) => section.questions);
  const [currentQuestionId, setCurrentQuestionId] = useState(questions[0]?.id ?? "");
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [markedIds, setMarkedIds] = useState<Set<string>>(new Set());
  const [autosaveLabel, setAutosaveLabel] = useState("All changes saved");
  const [secondsRemaining, setSecondsRemaining] = useState(quiz.timeLimitMin * 60);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const currentIndex = questions.findIndex((question) => question.id === currentQuestionId);
  const currentQuestion = questions[currentIndex] ?? questions[0];
  const answeredIds = new Set(Object.keys(answers).filter((questionId) => {
    const value = answers[questionId];
    return Array.isArray(value) ? value.length > 0 : value.trim().length > 0;
  }));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsRemaining((value) => (value > 0 ? value - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  function formatTime(value: number) {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function handleAnswerChange(value: string | string[]) {
    setAutosaveLabel("Unsaved changes");
    setAnswers((current) => ({ ...current, [currentQuestion.id]: value }));
    window.setTimeout(() => setAutosaveLabel("Saved just now"), 300);
  }

  return (
    <QuizPageShell.Root>
      <QuizPageShell.Body className="gap-5">
        <QuizAttemptHeader
          answeredCount={answeredIds.size}
          autosaveLabel={autosaveLabel}
          currentIndex={currentIndex}
          reviewCount={markedIds.size}
          timeRemaining={formatTime(secondsRemaining)}
          totalQuestions={questions.length}
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="flex flex-col gap-5">
            <QuizQuestionCard
              question={currentQuestion}
              answer={answers[currentQuestion.id] ?? null}
              isMarked={markedIds.has(currentQuestion.id)}
              onAnswerChange={handleAnswerChange}
              onMarkToggle={(nextValue) => setMarkedIds((current) => {
                const next = new Set(current);
                if (nextValue) next.add(currentQuestion.id);
                else next.delete(currentQuestion.id);
                return next;
              })}
            />

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.75rem] border border-border/70 bg-card/85 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="size-4" />
                Save and next keeps your progress moving without losing context.
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-full" disabled={currentIndex === 0} onClick={() => setCurrentQuestionId(questions[currentIndex - 1]?.id ?? currentQuestion.id)}>
                  <ChevronLeft data-icon="inline-start" />
                  Previous
                </Button>
                <Button variant="outline" className="rounded-full" onClick={() => currentIndex < questions.length - 1 ? setCurrentQuestionId(questions[currentIndex + 1].id) : setIsSubmitOpen(true)}>
                  Save and next
                  <ChevronRight data-icon="inline-end" />
                </Button>
                <Button className="rounded-full" onClick={() => setIsSubmitOpen(true)}>Submit quiz</Button>
              </div>
            </div>
          </div>

          <QuizQuestionPalette
            answeredIds={answeredIds}
            currentQuestionId={currentQuestion.id}
            markedIds={markedIds}
            onSelect={setCurrentQuestionId}
            questionIds={questions.map((question) => question.id)}
          />
        </div>
      </QuizPageShell.Body>

      <AlertDialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
        <AlertDialogContent size="sm" className="rounded-[1.5rem]">
          <AlertDialogHeader>
            <AlertDialogMedia><CheckCircle2 /></AlertDialogMedia>
            <AlertDialogTitle>Ready to submit?</AlertDialogTitle>
            <AlertDialogDescription>You have answered {answeredIds.size} of {questions.length} questions and marked {markedIds.size} for review.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep reviewing</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push("/attempts/attempt-3")}>Submit now</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </QuizPageShell.Root>
  );
}
