import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { roles } from "@/lib/auth/roles"

export default async function AdminPage() {
  const session = await auth()

  // Protection Layer: Only ADMIN role can access this page
  if (session?.user?.role !== roles.admin) {
    redirect("/")
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Welcome to the protected admin area, {session.user.name}. 
            Only users with the <strong>ADMIN</strong> role can see this page.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
