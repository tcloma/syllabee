# ✅ Syllaby – MVP Sprint Task Breakdown

**Sprint Duration:** June 21 – July 5, 2025  
**Goal:** Upload → Embed → Ask (Core RAG Flow)

---

## 📦 Phase 0: Monorepo Setup (Day 0–2)

- [x] Initialize monorepo with Bun: `bun init`, `bunfig.toml`, `tsconfig.json`
- [x] Create folders: `apps/api`, `apps/web`, `apps/extension` (stubbed)
- [x] Create packages: `core`, `types`, `ui`
- [x] Set up `.env` with `OPENAI_API_KEY`, `TURSO_DATABASE_URL`
- [x] Install dependencies:
  - Bun, Hono, Turso, Drizzle
  - SvelteKit, TailwindCSS, shadcn/ui
  - pdf-parse, mammoth
- [x] Optional: Add GitHub repo + CI (e.g., GitHub Actions)

---

## 🔌 Phase 1: Core Backend (Day 3–6)

- [x] Create `/upload` API:
  - [x] Accept PDF/DOCX
  - [x] Convert to text using `pdf-parse`, `mammoth`
  - [x] Chunk by page/section
- [ ] Generate embeddings:
  - [ ] Use `text-embedding-3-small` via OpenAI
  - [ ] Store vectors + metadata in Turso
- [ ] Create `/ask` API:
  - [ ] Vector search (top-k relevant chunks)
  - [ ] Inject into GPT prompt
  - [ ] Return streamed answer
- [ ] Add Redis or LRU cache for embeddings (optional)

---

## 🧑‍🎓 Phase 2: Frontend MVP (Day 7–11)

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

---

## 🧪 Phase 3: UX Polish + QA (Day 12–14)

- [ ] Add summary preview of vectorized chunks
- [ ] Handle errors:
  - [ ] Upload failure
  - [ ] LLM timeout
- [ ] Prevent duplicate embeddings:
  - [ ] Fingerprint content hash
- [ ] Add sample syllabus PDF for demo/testing
- [ ] Prepare early access tester instructions

---

## 🧠 MVP Validation Checklist

- [ ] Upload works for PDF and DOCX
- [ ] Embeddings are stored and retrievable
- [ ] `/ask` returns context-aware answers
- [ ] UI is minimal, clear, and functional
- [ ] Responses persist across sessions (Turso-backed)
- [ ] Demo file included with meaningful answers

---

## 📌 Stretch Goals (Optional)

- [ ] “Quiz Me” button to generate 3 MCQs per file
- [ ] Save chat history locally
- [ ] Auth via Lucia or Clerk (email only)
- [ ] Add chunk metadata to response (filename, page)

---

**Total Tasks:** ~40  
**Daily Target:** ~3–4 tasks/day  
**Focus:** Fast value delivery with minimal scope creep

> _“Upload → Ask → Understand.” Let’s build the classmate you wish you had._
