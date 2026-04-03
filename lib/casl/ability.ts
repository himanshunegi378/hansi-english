import { AbilityBuilder, createMongoAbility, MongoAbility } from "@casl/ability"

export type Actions = "manage" | "create" | "read" | "update" | "delete"
export type Subjects = "User" | "Post" | "AdminPanel" | "all"

export type AppAbility = MongoAbility<[Actions, Subjects]>

export function defineAbilitiesFor(role: string) {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility)

  if (role === "ADMIN") {
    can("manage", "all") // Admins can do everything
  } else {
    can("read", "Post") // Users can read posts
    can("create", "Post") // Users can create posts
    cannot("manage", "AdminPanel") // Users cannot access the admin panel
  }

  return build()
}
