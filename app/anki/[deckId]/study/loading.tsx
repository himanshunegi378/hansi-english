import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Renders the loading skeleton for the study route.
 * @returns Study-session loading state.
 */
export default function Loading() {
  return (
    <main className="min-h-screen bg-linear-to-b from-background via-secondary/20 to-background">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-8 sm:px-8 sm:py-12">
        <Skeleton className="h-6 w-28 rounded-full" />
        <Skeleton className="h-14 w-full max-w-3xl" />
        <Card className="rounded-[2rem] border-border/70 bg-card/90">
          <CardHeader className="gap-3">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Skeleton className="h-48 w-full rounded-[1.5rem]" />
            <Skeleton className="h-28 w-full rounded-[1.5rem]" />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
