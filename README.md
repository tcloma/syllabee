# 🌼🐝 Syllabee
> _A Context-Aware, AI-Powered Study Companion for Students_

## 🌱 Vision

To build an intelligent, contextualized learning assistant that makes studying easier, faster, and more effective for students by automatically understanding course materials and providing personalized insights, summaries, and quiz tools — all in one accessible platform.


###  Problem Statement

Students are drowning in disorganized information spread across LMS platforms, notes, and readings. Traditional study tools are:
- Generic and not context-aware
- Time-consuming to use effectively
- Poorly integrated with real academic workflows

**Syllaby solves this** by turning class materials into dynamic, interactive study companions — using AI to understand the content and help students retain and apply knowledge better.

## 🌻 MVP Core Features

- Upload PDF, DOCX, PPT, TXT, and MD — convert to vectorized context
- Ask natural language questions like “When is my quiz?” or “What is this concept?”
- Per-Class Context Isolation – every class has its own knowledge base
### Post MVP Features
- Generate personalized summaries and study guides
- Create AI-powered mock quizzes and flashcards
- Chrome Extension to scrape LMS content (e.g. Canvas)
- Continuous learning context – build over time, like a memory

## 🍯 Tech Stack

**Core Technologies:**
- Runtime: `Bun`
- Backend: `Hono` + `Postgres + pg_vector` + `Drizzle ORM`
- LLM: `OpenAI SDK (GPT-4.1 / 4.1-mini, text-embedding-3-small)`
- Frontend: `SvelteKit` (Web), `Svelte + Vite` (Extension)
- Shared Packages: `core`, `types`, `ui`, `db`
- File Parsing: `pdf-parse`, `mammoth`, `textract`

---
#  Syllabee – MVP Sprint Task Breakdown

**Sprint Duration:** June 23 – July 7, 2025  
**Goal:** Upload → Embed → Ask (Core RAG Flow)


**Total Tasks:** ~40  
**Daily Target:** ~3–4 tasks/day  
**Focus:** Fast value delivery with minimal scope creep

> _“Upload → Ask → Understand.” Let’s build the classmate you wish you had._


## 🌱 Phase 0: Monorepo Setup (Day 0–2)

- [x] Initialize monorepo with Bun: `bun init`, `package.json`, `tsconfig.json`
- [x] Create folders: `apps/api`, `apps/web`, `apps/extension` (stubbed)
- [x] Create packages: `core`, `types`, `ui`
- [x] Set up `.env` with `OPENAI_API_KEY`, `DB_URL`
- [x] Install dependencies:
  - Bun, Hono, Supabase, Drizzle
  - SvelteKit, TailwindCSS, shadcn/ui
  - pdf-parse, mammoth
- [x] Optional: Add GitHub repo + CI (e.g., GitHub Actions)


## 🥀 Phase 1: Core Backend (Day 3–6)

- [x] Create `/upload` API:
  - [x] Accept PDF, DOCX, TXT, MD
  - [x] Convert to text using `pdf-parse`, `mammoth`
  - [x] Chunk by page/section
- [x] Setup database
  - [x] Define table schema for `users`, `classes`, `files`, and `chunks`
  - [x] Install pg_vector extension on Supabase Postgres
  - [x] Generate / push schema and run migrations
  - [x] Seed and Index Vectors
- [x] Generate embeddings:
  - [x] Use `text-embedding-3-small` via OpenAI
  - [x] Store vectors + metadata in Supabase
- [x] Create `/ask` API:
  - [x] Vector search (top-k relevant chunks)
  - [x] Inject into GPT prompt
  - [ ] Return streamed answer
- [ ] Add Redis or LRU cache for embeddings (optional)

## 🌹 Phase 2: Frontend MVP (Day 7–11)

- [ ] Build base SvelteKit app layout
- [ ] File Upload UI:
  - [ ] Drag & drop or file picker
  - [ ] Call `/upload` and show status
- [ ] Display uploaded files:
  - [ ] Filename, last updated, class tag
- [ ] Chat UI:
  - [ ] Input field, submit button
  - [ ] Show streaming answers
- [ ] Add dropdown for selecting class/file context
- [ ] Toasts or modals for error/success feedback

## 🌷 Phase 3: UX Polish + QA (Day 12–14)

- [ ] Add summary preview of vectorized chunks
- [ ] Handle errors:
  - [ ] Upload failure
  - [ ] LLM timeout
- [ ] Prevent duplicate embeddings:
  - [ ] Fingerprint content hash
- [ ] Add sample syllabus PDF for demo/testing
- [ ] Prepare early access tester instructions

## 🌸 MVP Validation Checklist

- [ ] Upload works for PDF and DOCX
- [ ] Embeddings are stored and retrievable
- [ ] `/ask` returns context-aware answers
- [ ] UI is minimal, clear, and functional
- [ ] Responses persist across sessions (Turso-backed)
- [ ] Demo file included with meaningful answers

## 💐 Stretch Goals (Optional)

- [ ] “Quiz Me” button to generate 3 MCQs per file
- [ ] Save chat history locally
- [ ] Auth via Lucia or Clerk (email only)
- [ ] Add chunk metadata to response (filename, page)

---
> # 🌻   ᜓ  ᜒ  𖬰  ˖  ﾟ ˖  ﾟ ˖  ﾟ ・  ᠂  🐝  ᠂   ・    ᜓ  ᜒ  𖬰  ˖  ﾟ ˖  ﾟ ˖  ﾟ˖ 𖬰  ᜒ  ᜓ  🍯
---
