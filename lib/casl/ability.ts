import { AbilityBuilder, createMongoAbility, MongoAbility } from "@casl/ability"

export type Actions = "manage" | "create" | "read" | "update" | "delete"
export type Subjects = "User" | "Post" | "AdminPanel" | "StoryCreator" | "all"

export type AppAbility = MongoAbility<[Actions, Subjects]>

export function defineAbilitiesFor(role: string) {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility)

  if (role === "ADMIN") {
    can("manage", "all") // Admins can do everything
  } else {
    can("read", "Post")
    can("create", "Post")
    cannot("manage", "AdminPanel")
    cannot("create", "StoryCreator")
  }

  return build()
}
