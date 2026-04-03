# RBAC Implementation Approach: Next.js 16 + Auth.js + Prisma

## What is RBAC and Why Use It?

Role-Based Access Control (RBAC) is a security model where permissions are assigned to roles, and users are assigned to those roles.
- **Problem**: Need to restrict certain application features (e.g., admin dashboard, chat logs) to authorized users only.
- **Benefits**: Scalable permission management, cleaner code (no hardcoded user IDs), and improved security.
- **When it applies**: Any multi-user application where user responsibilities differ (e.g., Admin vs User).

## Overview of the Solution Process

We will implement a tight integration between **Auth.js (v5)** and **Prisma** to manage sessions and roles.

- **Main steps**: Schema update -> Auth configuration -> Session augmentation -> Middleware (Proxy) protection.
- **Key dependencies**: `next-auth@beta`, `@auth/prisma-adapter`.
- **Expected outcome**: Type-safe roles available in both client and server components, with automatic route gating.

## Step-by-Step Approach

### Step 1: Database Schema Update
Add a `Role` enum and `role` field to the `User` model in `prisma/schema.prisma`. This ensures type safety at the database level.

### Step 2: Auth.js Configuration (`auth.ts`)
Create a central `auth.ts` file to configure the Prisma adapter and social/credentials providers.

### Step 3: Session & JWT Augmentation
Configure the `session` and `jwt` callbacks in `auth.ts` to fetch the user's role and make it available in the session object.

### Step 4: Type Safety (`next-auth.d.ts`)
Create a TypeScript declaration file to extend the `Session` and `User` interfaces, allowing `session.user.role` to be accessed without type errors.

### Step 5: Route Protection (`proxy.ts`)
Implement the new **`proxy.ts`** convention (replaces `middleware.ts` in Next.js 16) to handle global route gating and redirects.

## Handling Errors and Edge Cases

### What Happens When a User is Unauthorized?
They will be redirected to the `/login` page or a custom `/unauthorized` page by the proxy logic.

### What About Role Changes?
Since we use the Prisma adapter, role changes in the database take effect immediately on session refresh.

## Integration with Existing Tools
- **Prisma**: Uses the existing client initialized in `lib/prisma.ts`.
- **Shadcn UI**: Use the `session` data to conditionally show buttons or sections in the UI.

## Benefits of This Approach
1. **Performance**: Leverages Next.js 16 Proxy for edge-side responses.
2. **Standard-Based**: Uses the industry-standard Auth.js v5.
3. **Future-Proof**: Easy to add a `Permission` model later if needed.

## Next Steps После Implementation
1. Configure social providers.
2. Implement a `/admin` route.
3. Test RBAC logic.

## Implementation Checklist
- [ ] Install `next-auth@beta` and `@auth/prisma-adapter`
- [ ] Update `prisma/schema.prisma` with `Role` enum
- [ ] Run `npx prisma generate` and `npx prisma db push`
- [ ] Create `auth.ts` configuration
- [ ] Create `proxy.ts` for route gating
- [ ] Add `next-auth.d.ts` for type safety
