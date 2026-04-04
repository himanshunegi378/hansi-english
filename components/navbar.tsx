"use client"

import Link from "next/link";
import { BookOpenText, Library, LogIn, PenSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button-variants";
import { UserNav } from "@/components/user-nav";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { type Session } from "next-auth";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/story", label: "Story Studio", icon: PenSquare },
  { href: "/stories", label: "Library", icon: Library },
];

interface NavbarProps {
  session: Session | null;
}

/**
 * Global navigation header for the application.
 */
export function Navbar({ session }: NavbarProps) {
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
            {navigationItems.map(({ href, icon: Icon, label }) => (
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
        </div>
      </div>
    </motion.header>
  );
}
