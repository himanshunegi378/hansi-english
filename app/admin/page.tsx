import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { roles } from "@/lib/auth/roles"

export default async function AdminPage() {
  const session = await auth()

  // Protection Layer: Only ADMIN role can access this page
  if (session?.user?.role !== roles.admin) {
    redirect("/")
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-5 py-10 sm:px-8">
      <Card className="rounded-[2rem] border-border/70 bg-card/90 shadow-sm">
        <CardHeader className="gap-3">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Admin area</p>
          <CardTitle className="font-heading text-4xl tracking-tight">Control the learning surfaces.</CardTitle>
          <CardDescription className="max-w-2xl text-sm leading-7">
            Welcome to the protected admin area, {session.user.name}. Use the quiz studio to author assessments with the same editorial tone used across the rest of Hansi English.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button className="rounded-full" render={<Link href="/admin/quizzes" />}>Open Quiz Studio</Button>
          <Button variant="outline" className="rounded-full" render={<Link href="/story" />}>Open Story Studio</Button>
        </CardContent>
      </Card>
    </div>
  )
}
