import { StoryCreator } from "@/features/story";

export const metadata = {
  title: "Create AI Story - Hansi English",
  description: "Generate personalized stories to improve your English proficiency with Hansi English.",
};

export default function StoryPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900 pt-12">
      <StoryCreator />
    </main>
  );
}
