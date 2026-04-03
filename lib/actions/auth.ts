"use server"

import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { signIn } from "@/auth"
import { AuthError } from "next-auth"

export async function register(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })
  } catch (err: unknown) {
    if (err instanceof Error && "code" in err && err.code === "P2002") {
      return { error: "User already exists" }
    }
    return { error: "Internal server error" }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" }
        default:
          return { error: "Something went wrong" }
      }
    }
    throw error
  }
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" }
        default:
          return { error: "Something went wrong" }
      }
    }
    throw error
  }
}
