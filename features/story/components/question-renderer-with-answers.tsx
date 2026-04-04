"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { type GeneratedQuestion } from "../types";
import { Badge } from "@/components/ui/badge";
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <header className="flex justify-between items-center px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 id="preview-heading" className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Question Preview
            </h2>
            <Badge variant="outline" className="bg-zinc-100/50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 border-none px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold">
              {questions.length} Questions
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Complete overview of generated logic and answer keys.
          </p>
        </div>
      </header>

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
              <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800 shadow-sm transition-shadow hover:shadow-md">
                <CardHeader className="pb-3 bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800/50">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <QuestionType type={question.type} />
                    {question.correctAnswer && <AnswerIndicator />}
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
