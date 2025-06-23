# 🧠 Syllaby
> _A Context-Aware, AI-Powered Study Companion for Students_

## 🎯 Vision

To build an intelligent, contextualized learning assistant that makes studying easier, faster, and more effective for students by automatically understanding course materials and providing personalized insights, summaries, and quiz tools — all in one accessible platform.


## 🚨 Problem Statement

Students are drowning in disorganized information spread across syllabi, LMS platforms, notes, and readings. Traditional study tools are:
- Generic and not context-aware
- Time-consuming to use effectively
- Poorly integrated with real academic workflows

**Syllaby solves this** by turning class materials into dynamic, interactive study companions — using AI to understand the content and help students retain and apply knowledge better.

## 🧠 Core Features

- 📁 Upload PDFs, DOCX, PPTs — convert to vectorized context
- 💬 Ask natural questions like “When is my quiz?” or “What is this concept?”
- 🧾 Generate personalized summaries and study guides
- 🧪 Create AI-powered mock quizzes and flashcards
- 🌐 Chrome Extension to scrape LMS content (e.g. Canvas)
- 🧱 Per-Class Context Isolation – every class has its own knowledge base
- 🔄 Continuous learning context – build over time, like a memory

## 🧰 Tech Stack

**Core Technologies:**
- Runtime: `Bun`
- Backend: `Hono` + `Turso (libSQL)` + `Drizzle ORM`
- LLM: `OpenAI SDK (GPT-4o, text-embedding-3-small)`
- Frontend: `SvelteKit` (Web), `Svelte + Vite` (Extension)
- Shared Packages: `core`, `types`, `ui`
- File Parsing: `pdf-parse`, `mammoth` (DOCX), `textract`
- Deployment: AWS Lambda, Vercel, or Fly.io

## ⌨️ Development Concepts
> Syllaby is built around key technical pillars that enable contextual, intelligent, and interactive study support:

### 🌐 Frontend Development
- **Web-Based Dashboard**  
  Powered by **SvelteKit**, this is the main interface for uploading materials, viewing summaries, and chatting with the AI.
- **Chrome Extension**  
  Lightweight companion built with **Vite + Svelte**, enabling scraping and content injection from LMS platforms (e.g., Canvas).

### ⚙️ Backend Development
- **API Layer**  
  Built with **Hono** and served via **Bun**, delivering blazing-fast REST endpoints for uploads, questions, summaries, and more.
- **Authentication**  
  Optional session-based auth, with roadmap support for **Lucia**, **Clerk**, or OTP flows.

### 🤖 LLM Integration
- **OpenAI SDK**  
  Leverages GPT-4o and text-embedding-3-small for contextual Q&A, summarization, and quiz generation.
- **Vector DB Context**  
  Uses **Turso (libSQL)** to store embeddings and retrieve relevant context for every question or prompt.

### 🕸️ Web Scraping
- **Extension-Based LMS Scraping**  
  Pulls files and data from class portals like Canvas.
- **Optional Puppeteer Automation**  
  Future support for authenticated scraping pipelines and full class sync.

### 🧱 Monorepo Architecture
- **Bun Workspaces**  
  Shared codebase using Bun for runtime, workspace orchestration, and build speed.
- **Modular Structure**  
  Split into `apps/` (api, web, extension) and `packages/` (core, ui, types) for scalable development and collaboration.
