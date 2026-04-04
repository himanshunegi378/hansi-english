"use client";

import { type KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { BookOpenText, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { type EnglishLevel, type StoryListItem } from "../types";

const levelLabels: Record<EnglishLevel, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

/**
 * Truncates story content into a compact preview for list surfaces.
 * @param content The saved story content.
 * @returns A short readable preview string.
 */
function getPreview(content: string): string {
  return content.length > 120 ? `${content.slice(0, 117).trimEnd()}...` : content;
}

/**
 * Formats a saved story creation timestamp for display.
 * @param createdAt The ISO timestamp string.
 * @returns A compact date label.
 */
function formatCreatedAt(createdAt: string): string {
  return format(new Date(createdAt), "MMM d, yyyy");
}

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
  const router = useRouter();

  /**
   * Navigates to the read-only story page for a saved story.
   * @param storyId The saved story identifier.
   */
  function openStory(storyId: string) {
    router.push(`/story?storyId=${encodeURIComponent(storyId)}`);
  }

  /**
   * Supports keyboard activation for clickable story rows.
   * @param event The keyboard event from the interactive row.
   * @param storyId The saved story identifier.
   */
  function handleRowKeyDown(event: KeyboardEvent<HTMLElement>, storyId: string) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    openStory(storyId);
  }

  if (stories.length === 0) {
    return (
      <Card className="border-none shadow-xl bg-white/60 backdrop-blur-sm dark:bg-zinc-900/50">
        <CardContent className="p-6">
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <BookOpenText />
              </EmptyMedia>
              <EmptyTitle>No saved stories yet</EmptyTitle>
              <EmptyDescription>
                The shared library will appear here once an admin generates and saves the first story.
              </EmptyDescription>
            </EmptyHeader>
            {canCreateStories ? (
              <EmptyContent>
                <Link
                  href="/story"
                  className={cn(buttonVariants({ variant: "default" }))}
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
      transition={{ duration: 0.25 }}
    >
      <Card className="border-none shadow-xl bg-white/60 backdrop-blur-sm dark:bg-zinc-900/50">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>Saved Stories</CardTitle>
            <CardDescription>
              Explore the shared reading library created by admins for English learners.
            </CardDescription>
          </div>
          {canCreateStories ? (
            <Link
              href="/story"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <Sparkles data-icon="inline-start" />
              Create Story
            </Link>
          ) : null}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Preview</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stories.map((story) => (
                  <TableRow
                    key={story.id}
                    role="link"
                    tabIndex={0}
                    onClick={() => openStory(story.id)}
                    onKeyDown={(event) => handleRowKeyDown(event, story.id)}
                    className="cursor-pointer"
                  >
                    <TableCell className="font-medium">{story.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{levelLabels[story.level]}</Badge>
                    </TableCell>
                    <TableCell>{story.questionCount}</TableCell>
                    <TableCell>{formatCreatedAt(story.createdAt)}</TableCell>
                    <TableCell className="max-w-md whitespace-normal text-muted-foreground">
                      {getPreview(story.content)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-4 md:hidden">
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Card
                  role="link"
                  tabIndex={0}
                  onClick={() => openStory(story.id)}
                  onKeyDown={(event) => handleRowKeyDown(event, story.id)}
                  className="cursor-pointer"
                >
                  <CardHeader className="gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        <CardTitle className="text-lg">{story.title}</CardTitle>
                        <CardDescription>{formatCreatedAt(story.createdAt)}</CardDescription>
                      </div>
                      <Badge variant="outline">{levelLabels[story.level]}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <p className="text-sm text-muted-foreground">{getPreview(story.content)}</p>
                    <p className="text-sm font-medium">{story.questionCount} questions</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
