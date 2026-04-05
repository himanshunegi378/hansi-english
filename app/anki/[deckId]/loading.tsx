import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Renders the loading skeleton for the deck-detail route.
 * @returns Deck detail loading state.
 */
export default function Loading() {
  return (
    <main className="min-h-screen bg-linear-to-b from-background via-secondary/20 to-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 sm:px-8 sm:py-12 lg:px-10">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-14 w-full max-w-3xl" />
        <Card className="rounded-[2rem] border-border/70 bg-card/90">
          <CardHeader className="gap-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-16 w-full max-w-2xl" />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Skeleton className="h-40 w-full rounded-[1.5rem]" />
            <Skeleton className="h-52 w-full rounded-[1.5rem]" />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
