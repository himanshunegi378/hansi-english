import { notFound } from "next/navigation";
import {
  getSavedStoryByIdAction,
  StoryCreator,
  StoryReader,
} from "@/features/story";

export const metadata = {
  title: "Create AI Story - Hansi English",
  description: "Generate personalized stories to improve your English proficiency with Hansi English.",
};

interface StoryPageProps {
  searchParams: Promise<{ storyId?: string }>;
}

/**
 * Renders the story creator for admins or a read-only saved story view when a story id is present.
 * @param props The page props containing URL search parameters.
 * @returns The story route content.
 */
export default async function StoryPage({ searchParams }: StoryPageProps) {
  const { storyId } = await searchParams;

  if (storyId) {
    const story = await getSavedStoryByIdAction(storyId);

    if (!story) {
      notFound();
    }

    return (
      <main className="min-h-screen bg-linear-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900 pt-12">
        <StoryReader story={story} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900 pt-12">
      <StoryCreator />
    </main>
  );
}
