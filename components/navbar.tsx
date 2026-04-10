"use client"

import Link from "next/link";
import { BookOpenText, ClipboardCheck, Layers3, Library, LogIn, Menu, PenSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { UserNav } from "@/components/user-nav";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { type Session } from "next-auth";
import { roles } from "@/lib/auth/roles";
import { defineAbilitiesFor, permissions } from "@/lib/casl/ability";

type NavigationItem = {
  href: string;
  label: string;
  icon?: typeof PenSquare;
  requiresStoryCreator?: boolean;
  requiresQuizManager?: boolean;
};

const navigationItems: NavigationItem[] = [
  { href: "/", label: "Home" },
  { href: "/story", label: "Story Studio", icon: PenSquare, requiresStoryCreator: true },
  { href: "/stories", label: "Library", icon: Library },
  { href: "/quizzes", label: "Quizzes", icon: ClipboardCheck },
  { href: "/anki", label: "Anki", icon: Layers3 },
  { href: "/admin/quizzes", label: "Quiz Studio", icon: ClipboardCheck, requiresQuizManager: true },
];

interface NavbarProps {
  session: Session | null;
}

/**
 * Returns only the navigation items the current user is allowed to see.
 */
function getVisibleNavigationItems(session: Session | null): NavigationItem[] {
  const role = session?.user?.role ?? roles.user;
  const ability = defineAbilitiesFor(role);

  return navigationItems.filter((item) => {
    if (!item.requiresStoryCreator) {
      if (!item.requiresQuizManager) {
        return true;
      }

      return ability.can(permissions.quiz.manage.action, permissions.quiz.manage.subject);
    }

    return ability.can(permissions.story.creator.action, permissions.story.creator.subject);
  });
}

/**
 * Global navigation header for the application.
 */
export function Navbar({ session }: NavbarProps) {
  const visibleNavigationItems = getVisibleNavigationItems(session);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-6 sm:px-8 lg:px-10">
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-3 transition-opacity hover:opacity-90">
            <div className="flex size-11 items-center justify-center rounded-full border border-border/70 bg-secondary text-secondary-foreground">
              <BookOpenText />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-2xl leading-none tracking-[-0.04em]">
                Hansi English
              </span>
              <span className="hidden text-[0.68rem] uppercase tracking-[0.28em] text-muted-foreground sm:block">
                Story-based learning
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 rounded-full border border-border/70 bg-background/70 p-1 md:flex">
            {visibleNavigationItems.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {Icon ? <Icon /> : null}
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="hidden rounded-full px-3 py-1 text-[0.68rem] uppercase tracking-[0.24em] lg:inline-flex">
                {session.user?.role ?? "Learner"}
              </Badge>
              <UserNav />
            </div>
          ) : (
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "rounded-full px-5 transition-transform active:scale-95",
              )}
            >
              <LogIn data-icon="inline-start" /> Login
            </Link>
          )}

          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full md:hidden"
                  aria-label="Toggle Menu"
                />
              }
            >
              <Menu className="size-6" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l border-border/70 bg-background/95 backdrop-blur-xl sm:w-[350px]">
              <SheetHeader className="pb-6">
                <SheetTitle className="flex items-center gap-3 text-left">
                  <div className="flex size-10 items-center justify-center rounded-full border border-border/70 bg-secondary text-secondary-foreground">
                    <BookOpenText className="size-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-heading text-xl leading-none tracking-[-0.04em]">
                      Hansi English
                    </span>
                    <span className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                      Story-based learning
                    </span>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2">
                {visibleNavigationItems.map(({ href, icon: Icon, label }) => (
                  <SheetClose
                    key={href}
                    render={
                      <Link
                        href={href}
                        className="group flex items-center gap-4 rounded-2xl px-4 py-4 text-base font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground active:scale-[0.98]"
                      />
                    }
                  >
                    <div className="flex size-10 items-center justify-center rounded-xl border border-border/50 bg-background transition-colors group-hover:border-border group-hover:bg-accent/50">
                      {Icon ? <Icon className="size-5" /> : <Library className="size-5" />}
                    </div>
                    <span>{label}</span>
                  </SheetClose>
                ))}
              </nav>
              <div className="absolute bottom-10 left-6 right-6">
                <div className="rounded-2xl border border-border/50 bg-secondary/30 p-6">
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Master English through captivating stories and spaced repetition.
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
