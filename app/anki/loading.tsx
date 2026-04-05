import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Renders the loading skeleton for the deck-library route.
 * @returns Deck list loading state.
 */
export default function Loading() {
  return (
    <main className="min-h-screen bg-linear-to-b from-background via-secondary/20 to-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 sm:px-8 sm:py-12 lg:px-10">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-14 w-full max-w-3xl" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="rounded-[2rem] border-border/70 bg-card/90">
              <CardHeader className="gap-3">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-14 w-full" />
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Skeleton className="h-8 w-28 rounded-full" />
                <Skeleton className="h-32 w-full rounded-[1.5rem]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
