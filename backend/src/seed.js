import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import { initDatabase } from './db/init.js'
import { Post } from './db/models/post.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })
dotenv.config()

const sampleArticles = [
  {
    title: 'The Architecture of Distributed Systems Under the Midnight Sun',
    author: 'Elena Rostova',
    category: 'Engineering',
    tags: ['react', 'architecture', 'nodejs', 'performance'],
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    description: 'A deep dive into concurrent React, edge runtimes, distributed caching, and maintaining sub-100ms response times at scale.',
    contents: `# The Architecture of Distributed Systems

Building responsive and durable web applications requires embracing concurrency, deterministic caching, and decoupled services.

## The Shift Towards Edge Execution

Edge rendering and colocation of data logic have redefined how we think about latency. Rather than routing all requests to a monolithic central cluster, distributed systems let us evaluate queries closer to the client.

> "Simplicity is prerequisite for reliability." — Edsger W. Dijkstra

### Key Principles for Resilient Services
- **Decoupled State Management:** Keep frontend state optimistic with libraries like TanStack Query.
- **Strict Database Indexing:** Avoid sequential scans by matching indexes with high-cardinality query patterns.
- **Graceful Error Degradation:** Provide localized fallback views instead of failing the entire viewport.

\`\`\`javascript
// Efficient caching policy with TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})
\`\`\`

By adhering to these architectural standards, systems maintain predictable behavior under heavy concurrent load.`,
    featured: true,
  },
  {
    title: 'Designing for Readability: The Celestial Web',
    author: 'Marcus Vance',
    category: 'Design',
    tags: ['typography', 'design', 'ux', 'editorial'],
    coverImage: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=1200&q=80',
    description: 'Why proportion, typographic rhythm, and deliberate whitespace matter more than ever in digital publications.',
    contents: `# Designing for Readability: The Celestial Web

In an era of relentless notifications and visual clutter, reading interfaces must offer serenity and focus.

## The Golden Measure of Typography

When readers encounter long-form text, the eye moves across lines in fixations and saccades. A measure between **60 and 75 characters per line** ensures optimal comfort.

### The Elements of Editorial Calm
- **Typeface Pairing:** Combining an expressive serif headline with a neutral, legible sans-serif for interface chrome.
- **Vertical Rhythm:** Consistent baseline grids with deliberate multiples (8px, 16px, 24px).
- **Contrast Ratios:** Gentle midnight backgrounds with soft cyan text reduces ocular strain during extended nocturnal reading sessions.

> Good typography is like glass: it allows the reader to perceive the ideas without noticing the medium.`,
    featured: false,
  },
  {
    title: 'High-Throughput Queries with MongoDB and Mongoose 9',
    author: 'Daniel Bugl',
    category: 'Engineering',
    tags: ['mongodb', 'mongoose', 'database', 'backend'],
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    description: 'Techniques for schema optimization, projection tuning, and lean query execution in high-traffic Express APIs.',
    contents: `# High-Throughput Queries with MongoDB

Optimizing MongoDB performance starts at schema design and index alignment.

## Compound Indexing Strategies

Indexes must cover the exact sort and filter criteria. If queries sort by \`createdAt\` descending while filtering by \`category\`, a compound index \`{ category: 1, createdAt: -1 }\` eliminates expensive in-memory sorts.

### Query Optimization Checklist
- Always specify projections to prevent transfer of unused document fields.
- Use aggregation pipelines for grouped counts and analytics rather than multiple manual roundtrips.
- Monitor execution plans using \`explain('executionStats')\`.`,
    featured: false,
  },
  {
    title: 'Quiet Interfaces: Why Software Needs Space and Calm',
    author: 'Claire Delacroix',
    category: 'Culture',
    tags: ['craft', 'culture', 'product', 'minimalism'],
    coverImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
    description: 'Examining why focused, opinionated software products like Linear, Substack, and Notion resonate with practitioners.',
    contents: `# Quiet Interfaces: Why Software Needs Space and Calm

Software often suffers from feature creep. The tools that endure are those built with singular focus and obsessive attention to craft.

## Speed as a Core Feature

When a tool responds within 100 milliseconds, users perceive it as immediate. Every millisecond shaved off an interaction reduces cognitive friction and reinforces trust.

> "A design isn't finished when there is nothing more to add, but when there is nothing left to take away."`,
    featured: false,
  },
  {
    title: 'The Solitary Craft of Writing at Night',
    author: 'Daniel Bugl',
    category: 'Writing',
    tags: ['writing', 'craft', 'reflection', 'night'],
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    description: 'Exploring the quiet hours of nocturnal creativity when notifications fade and deep concentration takes hold.',
    contents: `# The Solitary Craft of Writing at Night

There is an inexplicable clarity that arrives after midnight. The ambient noise of the daytime internet dissipates, leaving only the steady rhythm of keystrokes.

## Cultivating a Distraction-Free Workspace

In nocturnal writing, your environment should mirror the calm outside your window:
- Minimalist interfaces without garish colors or persistent badges.
- Fluid typography that reads effortlessly without glare.
- The patience to let thoughts expand across paragraphs rather than compress into soundbites.`,
    featured: false,
  },
  {
    title: 'Getting Started with TanStack Query v5 in React 19',
    author: 'Elena Rostova',
    category: 'Tutorials',
    tags: ['react', 'tanstack', 'tutorial', 'frontend'],
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    description: 'A practical, step-by-step walkthrough of caching, optimistic updates, and cache invalidation strategies in TanStack Query.',
    contents: `# Getting Started with TanStack Query v5

TanStack Query manages asynchronous server state with elegance and power.

## Why Client State and Server State Differ

Client state belongs exclusively to your browser session. Server state is persisted remotely and shared across users. TanStack Query bridges the gap through deterministic cache invalidation.

### Standard Mutation Flow
1. Invoke mutation trigger with request payload.
2. Invalidate affected query keys on success (\`queryClient.invalidateQueries\`).
3. TanStack Query automatically refetches fresh data in the background and updates the UI seamlessly without a page reload.`,
    featured: false,
  },
]

async function seed() {
  try {
    await initDatabase()
    console.info('Clearing existing posts...')
    await Post.deleteMany({})

    console.info('Seeding sample celestial articles...')
    for (const article of sampleArticles) {
      const p = new Post(article)
      await p.save()
    }

    const count = await Post.countDocuments()
    console.info(`Successfully seeded ${count} celestial articles into the database!`)
  } catch (err) {
    console.error('Failed to seed database:', err)
  } finally {
    await mongoose.disconnect()
    process.exit(0)
  }
}

seed()
