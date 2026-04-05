import { type DefaultSession } from "next-auth"
import { type AppRole } from "@/lib/auth/roles"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `auth`, contains the session role.
   */
  interface Session {
    user: {
      /** The user's id in the system. */
      id: string
      /** The user's role in the system. */
      role: AppRole
    } & DefaultSession["user"]
  }

  interface AdapterUser {
    id: string
    role: AppRole
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    id: string
    role: AppRole
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** The user's id */
    id?: string
    /** The user's role */
    role?: AppRole
  }
}
