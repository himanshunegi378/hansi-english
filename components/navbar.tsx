"use client"

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Library, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button-variants";
import { UserNav } from "@/components/user-nav";
import { motion } from "framer-motion";
import { Session } from "next-auth";

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
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60 dark:bg-black/80 dark:border-zinc-800"
    >
      <div className="flex items-center justify-between p-4 max-w-7xl mx-auto h-16">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-90">
            <div className="bg-blue-600 p-1.5 rounded-xl shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
              <Image
                className="invert"
                src="/next.svg"
                alt="Next.js logo"
                width={64}
                height={12}
                priority
              />
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:block bg-linear-to-br from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500 bg-clip-text text-transparent">
              Hansi English
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/stories"
              className="text-muted-foreground transition-all hover:text-primary hover:translate-x-0.5 flex items-center gap-1.5"
            >
              <Library data-icon="inline-start" /> Stories
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground hidden lg:block bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-700">
                Logged in as <span className="font-semibold text-foreground uppercase">{session.user?.role}</span>
              </span>
              <UserNav />
            </div>
          ) : (
            <Link 
              href="/login" 
              className={cn(buttonVariants({ variant: "default", size: "sm" }), "rounded-full px-5 transition-transform active:scale-95")}
            >
              <LogIn data-icon="inline-start" /> Login
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
}
