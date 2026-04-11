<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
- when working in this project, you must use pnpm as the package manager
- when making components, you must think about how to decompose them into smaller components
- when building components, you must use shadcn ui and follow its skill and the frontend design skill
- when styling ui, you must use theme colors only
- when adding animations, you must use framer motion and follow its skill
- when working with the database, you must use prisma and follow its skill
- when writing code, you must keep it strongly typed and must not use `any`
- when doing ai related work, you must use ai sdk with the groq provider and follow its skill
- when generating structured ai output, you must use `generateText` instead of `generateObject`
- when writing functions and components, you must add jsdoc descriptions
- when implementing rbac, you must use casl
- when writing components, you must keep each component under 200 lines, or refactor it into smaller components and custom hooks
- when writing files with the `use server` directive, you must export only async functions
- when writing server actions, you must return json serializable error objects for expected failures and must not return `Error` instances
- when writing server actions, you must handle exceptions in `catch` and return a serialized error object
- when using tailwind classes, you must avoid hardcoded values like `text-[0.9rem]` and prefer standard classes like `text-sm` and `text-md`
- when organizing code in this project, you must follow the feature folders architecture
- Write main function first, helpers below it
- when changing logic, you must update the comments
