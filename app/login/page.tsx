"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { login } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { toast } from "sonner"
import Link from "next/link"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(formData: FormData) {
    setIsLoading(true)
    const result = await login(formData)
    setIsLoading(false)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Welcome back!")
      router.push("/")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 px-4 dark:bg-gray-900/50">
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Login</CardTitle>
          <CardDescription>
            Enter your email and password to log in
          </CardDescription>
        </CardHeader>
        <form action={onSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-primary hover:underline">
                Register
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
