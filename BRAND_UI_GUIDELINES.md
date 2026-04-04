# Hansi English Brand, UI, and UX Guidelines

Use this file before generating any new page, section, component, or visual refresh. The goal is consistency. Hansi English should feel like one product, not a different brand on every screen.

## Product Summary

Hansi English is an English-learning product built around reading.

The core experience is:
- learners read level-based stories
- learners get instant help with unfamiliar words or phrases
- learners answer comprehension questions
- learners build confidence through active practice, not passive memorization

This is not a generic AI tool, chatbot product, or developer demo. It is a learning product with a calm, literary, story-first identity.

## Brand Positioning

Hansi English should feel:
- thoughtful
- warm
- intelligent
- calm
- structured
- encouraging
- literary

Hansi English should not feel:
- flashy SaaS
- crypto
- gaming UI
- neon cyberpunk
- overly corporate
- childish
- “AI startup template”

## Core Brand Idea

The brand metaphor is:
- reading desk
- open book
- quiet study ritual
- guided learning through stories

If a design direction does not feel connected to reading, language, or learning, it is probably off-brand.

## Audience

Design for:
- English learners who want confidence
- people who learn best by reading in context
- users who want support without feeling judged
- learners across beginner to advanced levels

The UX should reduce anxiety, not increase it.

## Design Personality

Preferred visual tone:
- editorial
- refined
- bookish
- modern but not futuristic
- minimal with character

A good Hansi English screen should feel like:
- a modern language journal
- a reading workspace
- a premium but approachable study tool

## Visual System

### Color

Use theme tokens only.

Preferred palette behavior:
- mostly monochrome and neutral
- strong use of `background`, `foreground`, `card`, `muted`, `secondary`, `border`, and `primary`
- subtle tonal layering instead of bright multicolor gradients
- accents should feel restrained and purposeful

Rules:
- do not introduce random brand-new colors
- do not use purple-heavy startup gradients
- do not use bright blues, pinks, or neon accents unless the design system is explicitly updated first
- prefer contrast through tone, texture, border, opacity, and spacing

### Typography

Current brand type direction:
- body: Geist
- mono: Geist Mono
- heading/display: Fraunces

Typography rules:
- use `font-heading` for hero statements, section titles, and emphasis moments
- use `font-sans` for body copy, labels, navigation, and utility text
- headlines should feel literary and confident
- body text should feel quiet and readable

Avoid:
- generic startup typography stacks
- overly playful display fonts
- condensed or aggressive tech-looking type treatments

### Shape Language

Preferred shapes:
- rounded-full for pills and navigation controls
- rounded-3xl to rounded-[2rem] for major cards and hero containers
- soft, generous curves

This brand should feel softened and tactile, not sharp or brutalist.

### Surfaces

Preferred surface treatment:
- layered panels
- subtle borders
- translucent backgrounds where helpful
- soft blur
- restrained shadow depth

Use:
- `border-border/60` or `border-border/70`
- `bg-background/70+`
- `bg-card/90`
- `bg-secondary/70+`
- light atmospheric blur for hero or header surfaces

Avoid:
- flat empty white pages with no depth
- heavy glow effects
- glassmorphism taken to extremes
- giant dark gradients unrelated to the brand

## Layout Principles

### Overall Composition

Preferred layout behavior:
- generous breathing room
- strong hierarchy
- asymmetry where it helps create interest
- one memorable focal area per screen

Screens should not feel crowded. Every major page should have:
- a clear primary action
- a readable headline
- visible supporting context

### Containers

Preferred widths:
- major page container around `max-w-7xl`
- reading/product content around `max-w-4xl`
- tighter text blocks for readability

### Spacing

Use deliberate spacing with `gap-*`.

Preferred rhythm:
- hero sections: spacious
- cards: comfortable
- forms: clean and uncluttered
- reading experiences: generous line height and whitespace

Avoid cramped interfaces and dense dashboard-style packing.

## Motion Principles

Motion should feel:
- calm
- smooth
- brief
- supportive

Preferred motion patterns:
- fade and slight upward movement on load
- gentle stagger for lists or stacked content
- subtle hover movement
- soft transform transitions

Use Framer Motion for meaningful entrance and orchestration.

Avoid:
- bouncing UI
- exaggerated springiness
- constant motion
- distracting animation loops
- flashy parallax for its own sake

## Component Direction

### Navigation

Navigation should feel:
- clean
- light
- easy to scan
- editorial rather than app-shell heavy

Use:
- pill navigation
- subtle borders
- compact labels
- quiet secondary metadata

### Buttons

Buttons should feel:
- intentional
- readable
- not oversized by default

Preferred button styling:
- rounded-full for primary CTA moments
- uppercase tracking only when it supports the editorial voice
- semantic theme tokens only

Avoid:
- loud gradients
- oversized glowing buttons
- too many button variants on one screen

### Cards

Cards should feel like study surfaces, reading notes, or library objects.

Use:
- layered neutral surfaces
- soft border emphasis
- subtle lift on hover

Avoid:
- generic SaaS statistic cards everywhere
- random colorful icon blocks

### Forms

Forms should feel calm and guided.

Use:
- clear labels
- spacious stacking
- short supporting descriptions
- obvious primary action

Avoid:
- noisy validation states
- crowded multi-column forms unless clearly needed

## UX Principles

### Learning Experience

The product should always help the user feel:
- capable
- guided
- unstuck

UX rules:
- explain what the user can do next
- keep actions obvious
- reduce ambiguity
- make reading easy
- make vocabulary help feel immediate and lightweight

### Clarity Over Cleverness

The UI can be elegant, but it must remain obvious.

Do:
- use familiar labels
- keep flows simple
- make progress visible

Do not:
- hide primary actions
- over-design simple tasks
- use abstract labels when clear labels exist

### Reading-First UX

Because this is an English-learning product, readability matters more than decoration.

Prioritize:
- comfortable line lengths
- generous line height
- strong contrast
- clear hierarchy between story, helper UI, and actions

## Copy and Messaging

Voice should be:
- encouraging
- clear
- intelligent
- calm
- supportive

Preferred copy themes:
- reading
- understanding
- confidence
- progress
- practice
- story-based learning

Avoid copy that sounds:
- hype-heavy
- overly technical
- robotic
- generic AI marketing

Prefer:
- "Learn by reading, not memorizing"
- "Story-based learning"
- "Build confidence"
- "Explore the library"
- "Start a story"

Avoid:
- "Supercharge your workflow"
- "Next-generation AI platform"
- "Revolutionize your productivity"

## What To Avoid

Never generate UI that looks like:
- a generic startup landing page
- a finance dashboard
- a crypto product
- a gaming launcher
- a purple gradient AI clone
- a random Dribbble experiment disconnected from learning

Never default to:
- purple on white
- blue-to-purple hero gradients
- glass cards everywhere
- floating blobs with no purpose
- huge icon circles in many different colors
- empty marketing fluff sections

## Preferred Reference Pattern

When in doubt, use this mental model:
- editorial landing page
- calm library interface
- modern reading companion

The current homepage and navbar are the baseline reference for the public-facing aesthetic.

## Implementation Rules For Future LLM Work

Before generating UI:
1. identify the user goal on that screen
2. map it to the Hansi English brand idea: reading, learning, confidence
3. use theme tokens only
4. use `font-heading` sparingly for emphasis
5. keep motion subtle and intentional
6. prefer shadcn primitives over custom random markup
7. make the result feel related to the existing homepage and navbar

## Prompting Shortcut

When asking an LLM to generate UI for this project, include guidance like:

> Follow `BRAND_UI_GUIDELINES.md`. This is an English-learning product with an editorial, story-first, reading-desk aesthetic. Use theme tokens only, keep the interface calm and literary, and avoid generic startup or flashy AI visuals.

