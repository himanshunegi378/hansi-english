"use client";

import Link from "next/link";
import { LazyMotion, domMax, m } from "framer-motion";
import { Clock3, Layers3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QuizStatusBadge } from "./quiz-badges";
import type { QuizUiRecord } from "../../types/ui";

interface QuizCardProps {
  href: string;
  index: number;
  quiz: QuizUiRecord;
  action: string;
}

/**
 * Renders a quiz summary card for catalog and admin surfaces.
 * @param props Quiz data and destination link.
 * @returns Animated quiz card.
 */
export function QuizCard({ action, href, index, quiz }: QuizCardProps) {
  return (
    <LazyMotion features={domMax}>
      <m.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, duration: 0.28, ease: "easeOut" }}>
        <Card className="group h-full rounded-[1.75rem] border-border/70 bg-card/85 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
          <CardHeader className="gap-4 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex max-w-xl flex-col gap-3">
                <QuizStatusBadge status={quiz.status} />
                <CardTitle className="font-heading text-2xl tracking-tight text-foreground">
                  <Link href={href} className="transition-opacity hover:opacity-75">{quiz.title}</Link>
                </CardTitle>
                <CardDescription className="text-sm leading-6 text-foreground/75">{quiz.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 px-5 pb-5 sm:px-6 sm:pb-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Sections</p>
                <p className="mt-2 font-heading text-2xl">{quiz.sectionCount}</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Questions</p>
                <p className="mt-2 font-heading text-2xl">{quiz.questionCount}</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Pass mark</p>
                <p className="mt-2 font-heading text-2xl">{quiz.passingScore}%</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4 text-sm text-muted-foreground">
              <div className="inline-flex items-center gap-2"><Clock3 className="size-4" /> {quiz.timeLimitMin} min</div>
              <div className="inline-flex items-center gap-2"><Layers3 className="size-4" /> {action}</div>
            </div>
          </CardContent>
        </Card>
      </m.div>
    </LazyMotion>
  );
}
