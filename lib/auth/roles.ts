export const roles = {
  admin: "ADMIN",
  user: "USER",
} as const

export type AppRole = (typeof roles)[keyof typeof roles]
