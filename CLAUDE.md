# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**Wealthwolffs Global Hedged Solutions** — a premium financial advisory website. Full-stack: React (CRA + CRACO) frontend, FastAPI + MongoDB backend. The site is light-themed (white/navy/gold), Swiss Minimalist style, targeting institutional trust.

---

## Commands

All frontend commands run from `frontend/`:

```bash
# Start dev server (localhost:3000)
npm start          # uses craco start — yarn is the lockfile manager but npm works

# Production build
npm run build

# Run tests (interactive watch mode)
npm test

# Run a single test file
npm test -- --testPathPattern="src/components/Header"
```

Backend runs from `backend/`:

```bash
# Install Python deps
pip install -r requirements.txt

# Start FastAPI server (requires .env with MONGO_URL, DB_NAME)
uvicorn server:app --reload --port 8001
```

**Important:** `npm install` on this project requires `--legacy-peer-deps` due to a `react-day-picker` peer dep conflict:
```bash
npm install <package> --legacy-peer-deps
```

---

## Architecture

### Frontend (`frontend/src/`)

**Routing** — React Router v7, defined in `App.js`:
| Route | Page | Notes |
|---|---|---|
| `/` | `LandingPage` | Animated scramble hero, enter-site gate |
| `/home` | `MainSite` | Full marketing page, all sections |
| `/products/:productId` | `ProductPage` | wolffsinstaalerts, wolffsinstatrade, wolffsstreet |
| `/academy` | `AcademyPage` | Coming soon |
| `/admin` | `AdminDashboard` | Sidebar nav, role-gated |
| `/page/:pageId` | `HiddenPage` | Admin-created content pages |
| `/#session_id=...` | `AuthCallback` | OAuth return handled before routes render |

**State** — no global store. Auth state lives in `AuthContext` (`src/contexts/AuthContext.js`), consumed via `useAuth()`. All other state is local to components.

**Path alias** — `@/` resolves to `src/` (configured in `craco.config.js`). Always use `@/` imports, never relative `../../`.

**shadcn/ui** — component library lives in `src/components/ui/`. All Radix UI primitives are pre-installed. To use a component: copy the shadcn snippet into `src/components/ui/<name>.jsx`.

**Animation libraries:**
- `motion/react` (package: `motion`) — scroll-driven and layout animations
- WebGL shaders — inline in components using raw `webgl2` canvas (see `radial-orbital-timeline.jsx`)

### Backend (`backend/server.py`)

Single-file FastAPI app. All routes are on an `APIRouter` with prefix `/api`, then registered to the `app` at the bottom of the file.

**Auth flow:**
1. Frontend redirects to `https://auth.emergentagent.com/?redirect=<origin>/auth/callback`
2. OAuth provider returns to `/auth/callback` with `#session_id=<id>` in the URL fragment
3. `AuthCallback` page POSTs the session_id to `/api/auth/session`, which exchanges it with the Emergent auth service for user data
4. Backend sets an `httponly` session cookie (`session_token`) valid for 7 days
5. All subsequent authenticated requests send credentials via `credentials: 'include'`

**Admin protection:** endpoints check `user.role === "admin"` via `require_admin(request)` dependency. Role is set manually in MongoDB or via the admin panel user management UI.

**MongoDB collections:** `users`, `user_sessions`, `enquiries`, `news_articles`, `testimonials`, `hidden_pages`.

**Environment variables required:**
- `MONGO_URL` — MongoDB connection string
- `DB_NAME` — database name
- Frontend: `REACT_APP_BACKEND_URL` — backend origin

### Design System

The authoritative source is `design_guidelines.json`. Key values:

**Colors (use exact hex, not Tailwind semantic names):**
- Background: `#FFFFFF`, Surface: `#F9F8F6`, Surface-secondary: `#F0EBE1`
- Primary navy: `#003B5C` (hover: `#002A42`)
- Gold accent: `#C4A47C` — **decorative only** (borders, backgrounds, gradients). For gold text on light backgrounds use `#7A5C35` (~6:1 contrast)
- Text primary: `#0A192F`, Text secondary: `#475569`, Border: `#E2E8F0`

**Typography:**
- Headings: `'Cabinet Grotesk', 'IBM Plex Sans', sans-serif`
- Body: `IBM Plex Sans, sans-serif`
- Mono/code accents: `IBM Plex Mono, monospace`
- Serif accent (quotes, italic emphasis): `Playfair Display, serif`

**CSS utility classes** (defined in `src/App.css` and `src/index.css`):
- `.overline` — gold uppercase label (uses `#7A5C35` for WCAG compliance)
- `.btn-primary` / `.btn-secondary` — sharp-cornered brand buttons
- `.card-lift` — hover lift + shadow transition
- `.glass-header` — glassmorphism sticky header
- `.section-fade` / `.section-fade.visible` — scroll-triggered fade-in (do NOT apply to sections containing sticky scroll animations)
- `.gradient-bar` — animated navy→gold 4px divider

**Border radius:** `rounded-none` or `rounded-sm` (max 4px). The design is sharp and institutional — never round.

---

## Critical Constraints

**Auth URL** — never hardcode the auth URL or add fallbacks. The login function in `AuthContext.js` must remain:
```js
window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
```

**New packages** — always install with `--legacy-peer-deps`.

**TypeScript components from external sources** — the project is JavaScript. Convert `.tsx` to `.jsx` by removing type annotations, interfaces, and TypeScript casts. Store WebGL uniform locations in a plain object, not as dynamic properties on `WebGLProgram`.

**Sticky scroll sections** — wrap with a plain `<section>`, not the `Section` component (which adds `section-fade` translateY that breaks `position: sticky`).

**`motion/react` imports** — use `import { motion, useScroll, useTransform } from 'motion/react'` (package name is `motion`, not `framer-motion`).

---

## Behavioral Guidelines

### 1. Think Before Coding
Before implementing: state assumptions explicitly. If multiple interpretations exist, present them. If something is unclear, stop and ask.

### 2. Simplicity First
Minimum code that solves the problem. No features beyond what was asked. No abstractions for single-use code. If you write 200 lines and it could be 50, rewrite it.

### 3. Surgical Changes
Touch only what you must. Match existing style. When your changes create orphan imports/variables/functions, remove them. Don't remove pre-existing dead code unless asked.

### 4. Goal-Driven Execution
For multi-step tasks, state a brief plan with verifiable checkpoints before starting, then execute step by step.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
