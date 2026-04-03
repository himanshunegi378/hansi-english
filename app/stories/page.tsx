import type { Metadata } from "next";
import { auth } from "@/auth";
import { getSavedStoriesAction, StoryList } from "@/features/story";

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

  return (
    <main className="min-h-screen bg-linear-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Story Library
          </h1>
          <p className="text-lg text-muted-foreground">
            Read saved stories and revisit their comprehension questions anytime.
          </p>
        </div>
        <StoryList
          canCreateStories={session?.user?.role === "ADMIN"}
          stories={stories}
        />
      </div>
    </main>
  );
}
