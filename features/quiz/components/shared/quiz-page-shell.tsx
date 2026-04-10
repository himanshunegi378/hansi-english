import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

function Root({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <main className="min-h-screen bg-linear-to-b from-background via-secondary/20 to-background">
      <div className={cn("mx-auto flex max-w-7xl flex-col gap-6 px-5 pb-16 pt-8 sm:gap-8 sm:px-8 sm:pb-20 sm:pt-12 lg:px-10", className)}>
        {children}
      </div>
    </main>
  );
}

function Header({ children, className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("flex flex-col gap-5", className)} {...props}>
      {children}
    </section>
  );
}

function Body({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-6 sm:gap-8", className)} {...props}>
      {children}
    </div>
  );
}

function Actions({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Compound layout primitive for quiz pages.
 */
export const QuizPageShell = {
  Actions,
  Body,
  Header,
  Root,
};
