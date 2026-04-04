"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpenText, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import { type StoryListItem } from "../types";
import { StoryListCard } from "./story-list-card";

/**
 * Renders the public saved stories library.
 * @param props The component props.
 * @returns The story list screen content.
 */
export function StoryList({
  canCreateStories,
  stories,
}: {
  canCreateStories: boolean;
  stories: StoryListItem[];
}) {
  if (stories.length === 0) {
    return (
      <Card className="rounded-[2rem] border-border/70 bg-card/90 shadow-xl shadow-primary/5 backdrop-blur-sm">
        <CardContent className="p-5 sm:p-6">
          <Empty className="rounded-[1.75rem] border-border/60 bg-background/70">
            <EmptyHeader>
              <EmptyMedia
                variant="icon"
                className="size-12 rounded-full bg-secondary text-secondary-foreground"
              >
                <BookOpenText />
              </EmptyMedia>
              <EmptyTitle className="text-lg">No saved stories yet</EmptyTitle>
              <EmptyDescription className="max-w-md">
                The shared library will appear here once an admin generates and saves the first story.
              </EmptyDescription>
            </EmptyHeader>
            {canCreateStories ? (
              <EmptyContent>
                <Link
                  href="/story"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "rounded-full px-5 uppercase tracking-[0.2em]",
                  )}
                >
                  <Sparkles data-icon="inline-start" />
                  Open Story Creator
                </Link>
              </EmptyContent>
            ) : null}
          </Empty>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className="border-none border-0 ring-0 bg-transparent shadow-none">
        <CardContent className="flex flex-col gap-4 px-0 pb-0 sm:gap-5">
          <div className="grid gap-3.5 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
            {stories.map((story, index) => (
              <StoryListCard key={story.id} story={story} index={index} />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
