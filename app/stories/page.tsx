import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { auth } from "@/auth";
import { buttonVariants } from "@/components/ui/button-variants";
import { getSavedStoriesAction, StoryList } from "@/features/story";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Saved Stories - Hansi English",
  description: "Browse saved English learning stories and quizzes from the shared library.",
};

/**
 * Renders the public shared stories library page.
 * @returns The saved stories route content.
 */
export default async function StoriesPage() {
  const [session, stories] = await Promise.all([auth(), getSavedStoriesAction()]);
  const canCreateStories = session?.user?.role === "ADMIN";

  return (
    <main className="relative min-h-screen px-6 py-10 sm:px-8 sm:py-12 lg:px-10">
      <div className="relative mx-auto flex max-w-7xl flex-col gap-8">
        <section id="story-library" className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex max-w-3xl flex-col gap-2">
              <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">
                Shared collection
              </p>
              <h2 className="font-heading text-3xl tracking-[-0.04em] sm:text-4xl">
                Choose a story and continue reading in context.
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-foreground/75">
                Each saved story combines reading practice, inline meaning support, and a short
                comprehension check.
              </p>
            </div>

            {canCreateStories ? (
              <Link
                href="/story"
                className={cn(buttonVariants({ variant: "default" }), "rounded-full px-5")}
              >
                <Sparkles data-icon="inline-start" />
                Create story
              </Link>
            ) : null}
          </div>

          <StoryList canCreateStories={canCreateStories} stories={stories} />
        </section>
      </div>
    </main>
  );
}
