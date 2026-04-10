import { AbilityBuilder, createMongoAbility, MongoAbility } from "@casl/ability"
import { roles, type AppRole } from "@/lib/auth/roles"

export const actions = {
  manage: "manage",
  create: "create",
  read: "read",
  update: "update",
  delete: "delete",
} as const

export type Actions = (typeof actions)[keyof typeof actions]

export const subjects = {
  user: "User",
  post: "Post",
  adminPanel: "AdminPanel",
  storyCreator: "StoryCreator",
  quiz: "Quiz",
  all: "all",
} as const

export type Subjects = (typeof subjects)[keyof typeof subjects]

export type AppAbility = MongoAbility<[Actions, Subjects]>

export type Permission = {
  action: Actions
  subject: Subjects
}

export const permissions = {
  admin: {
    panel: {
      action: actions.manage,
      subject: subjects.adminPanel,
    },
  },
  post: {
    read: {
      action: actions.read,
      subject: subjects.post,
    },
    create: {
      action: actions.create,
      subject: subjects.post,
    },
  },
  story: {
    creator: {
      action: actions.create,
      subject: subjects.storyCreator,
    },
  },
  quiz: {
    manage: {
      action: actions.manage,
      subject: subjects.quiz,
    },
  },
  system: {
    fullAccess: {
      action: actions.manage,
      subject: subjects.all,
    },
  },
} satisfies Record<string, Record<string, Permission>>

/**
 * Applies a list of permissions to the provided CASL rule function.
 * @param applyRule CASL `can` or `cannot` rule callback.
 * @param allowedPermissions Permission entries to apply.
 */
function applyPermissions(
  applyRule: (action: Actions, subject: Subjects) => void,
  allowedPermissions: Permission[],
) {
  for (const permission of allowedPermissions) {
    applyRule(permission.action, permission.subject)
  }
}

export function defineAbilitiesFor(role: AppRole) {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility)

  if (role === roles.admin) {
    applyPermissions(can, [permissions.system.fullAccess])
  } else {
    applyPermissions(can, [permissions.post.read, permissions.post.create])
    applyPermissions(cannot, [permissions.admin.panel, permissions.story.creator, permissions.quiz.manage])
  }

  return build()
}
