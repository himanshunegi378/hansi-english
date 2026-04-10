import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  detail: string;
  label: string;
  value: string;
  accent?: ReactNode;
}

/**
 * Renders a compact stat card used across quiz dashboards.
 * @param props Label, value, and supporting detail.
 * @returns Styled stat card.
 */
export function StatCard({ accent, detail, label, value }: StatCardProps) {
  return (
    <Card className="rounded-[1.75rem] border-border/70 bg-card/85 shadow-sm">
      <CardContent className="flex flex-col gap-3 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
          {accent}
        </div>
        <div className="font-heading text-3xl tracking-tight text-foreground sm:text-4xl">{value}</div>
        <p className="text-sm leading-6 text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}
