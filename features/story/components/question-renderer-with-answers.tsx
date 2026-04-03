"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Info } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type GeneratedQuestion } from "../types";

interface QuestionRendererWithAnswersProps {
  questions: GeneratedQuestion[];
}

/**
 * Renders the generated questions with answer guidance for admin review.
 * @param props The question renderer configuration and event handlers.
 * @returns The interactive question-and-answers section.
 */
export function QuestionRendererWithAnswers({ questions }: QuestionRendererWithAnswersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="flex justify-between items-end px-2">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Question Preview
        </h2>
        <p className="text-sm text-muted-foreground">
          Correct answers are shown by default for admin review.
        </p>
      </div>

      <div className="grid gap-6">
        {questions.map((question, index) => {
          return (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800">
                <CardHeader className="pb-3 bg-zinc-50/50 dark:bg-zinc-900/50">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-background border shadow-xs text-muted-foreground">
                      {question.type.replace("_", " ")}
                    </span>
                    {question.correctAnswer ? (
                      <span
                        className={cn(
                          "flex items-center gap-1 text-sm font-medium text-green-600"
                        )}
                      >
                        <CheckCircle2 data-icon="inline-start" /> Answer Included
                      </span>
                    ) : null}
                  </div>
                  <p className="text-lg font-medium leading-snug">{question.text}</p>
                </CardHeader>
                <CardContent className="pt-4">
                  {question.options ? (
                    <div className="grid gap-2">
                      {question.options.map((option, optionIndex) => {
                        const isOptionCorrect = option === question.correctAnswer;

                        return (
                          <div
                            key={optionIndex}
                            className={cn(
                              "w-full text-left p-3 rounded-lg border transition-all duration-200 group flex items-center justify-between",
                              isOptionCorrect
                                ? "border-green-500 bg-green-50 dark:bg-green-900/20 ring-1 ring-green-500"
                                : "opacity-60"
                            )}
                          >
                            <span className="flex-1">{option}</span>
                            {isOptionCorrect ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 ml-2" />
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Info data-icon="inline-start" /> This is an open-ended question.
                      </p>
                      {question.correctAnswer ? (
                        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                          <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                            Answer Guide
                          </p>
                          <p className="text-sm">{question.correctAnswer}</p>
                        </div>
                      ) : null}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
