# 🌼🐝 Syllabee
> _A Context-Aware, AI-Powered Study Companion for Students_

## 🌱 Vision

To build an intelligent, contextualized learning assistant that makes studying easier, faster, and more effective for students by automatically understanding course materials and providing personalized insights, summaries, and quiz tools — all in one accessible platform.


###  Problem Statement

Students are drowning in disorganized information spread across LMS platforms, notes, and readings. Traditional study tools are:
- Generic and not context-aware
- Time-consuming to use effectively
- Poorly integrated with real academic workflows

**Syllabee solves this** by turning class materials into dynamic, interactive study companions — using AI to understand the content and help students retain and apply knowledge better.

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

**Goal:** Upload → Embed → Ask (Core RAG Flow)


---
> # 🌻   ᜓ  ᜒ  𖬰  ˖  ﾟ ˖  ﾟ ˖  ﾟ ・  ᠂  🐝  ᠂   ・    ᜓ  ᜒ  𖬰  ˖  ﾟ ˖  ﾟ ˖  ﾟ˖ 𖬰  ᜒ  ᜓ  🍯
---
