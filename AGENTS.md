<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
- use pnpm as package manager
- When making components think about how we can decompose it into smaller components
- use shadcn ui for components (use its skill and frontend desing skill)
- use theme colors only
- use framer motion and its skill for animations
- use prisma for database (use its skill)
- always write strongly typed code. using any is banned
- use ai sdk with groq provider for ai related work (use its skill)
- use generateText instead of generateObject for ai
- add jsdoc description to functions and components
- casl is used for rbac
- no component should be more that 200 lines. if it is, then refactor it to smaller component, refactor logic to custom hook.
- files with 'use server' directive can only have async function exported
