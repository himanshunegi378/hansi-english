"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { type GeneratedQuestion } from "../types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  QuestionType, 
  AnswerIndicator, 
  QuestionTitle, 
  QuestionOption,
  QuestionOpenEnded
} from "./ui/question";

interface QuestionRendererWithAnswersProps {
  questions: GeneratedQuestion[];
}

/**
 * Renders questions in a read-only state for admin validation.
 * Correct answers are highlighted immediately to assist in quality control.
 */
export function QuestionRendererWithAnswers({ questions }: QuestionRendererWithAnswersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="flex flex-col gap-6"
    >
      <Card className="rounded-[2rem] border-border/70 bg-card/90 shadow-sm">
        <CardContent className="flex flex-col gap-4 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex max-w-2xl flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Validation tools
              </p>
              <h2 id="preview-heading" className="font-heading text-2xl text-foreground sm:text-3xl">
                Question review
              </h2>
              <p className="text-sm leading-7 text-muted-foreground">
                Check that each question is clear, answerable from the story, and aligned with the
                reading level.
              </p>
            </div>
            <Badge variant="outline" className="rounded-full bg-background/70 px-3 py-1">
              {questions.length} questions
            </Badge>
          </div>
          <Separator className="bg-border/70" />
        </CardContent>
      </Card>

      <div 
        className="grid gap-6" 
        role="list" 
        aria-labelledby="preview-heading"
      >
        {questions.map((question, index) => {
          return (
            <motion.div
              key={question.id || index}
              role="listitem"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden rounded-[2rem] border-border/70 bg-card/90 shadow-sm transition-shadow hover:shadow-md">
                <CardHeader className="gap-3 border-b border-border/70 bg-secondary/35 pb-4">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <QuestionType type={question.type} />
                    {question.correctAnswer ? <AnswerIndicator /> : null}
                  </div>
                  <QuestionTitle text={question.text} />
                </CardHeader>
                <CardContent className="pt-5">
                  {question.options ? (
                    <div className="grid gap-2.5" role="group" aria-label="Multiple choice options">
                      {question.options.map((option, optionIndex) => (
                        <QuestionOption
                          key={optionIndex}
                          index={optionIndex}
                          option={option}
                          isCorrect={option === question.correctAnswer}
                          disabled
                        />
                      ))}
                    </div>
                  ) : (
                    <QuestionOpenEnded correctAnswer={question.correctAnswer} />
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
