import { type DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `auth`, contains the session role.
   */
  interface Session {
    user: {
      /** The user's id in the system. */
      id: string
      /** The user's role in the system. */
      role: string
    } & DefaultSession["user"]
  }

  interface AdapterUser {
    id: string
    role: string
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    id: string
    role: string
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** The user's id */
    id?: string
    /** The user's role */
    role?: string
  }
}
