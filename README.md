# AI Companies Intelligence — Frontend

Next.js frontend for the B2B Data Enrichment platform. Supports Bulgarian (default) and English — toggle in the header.

> The API lives in a separate repo: [`ai-first-companies-intelligence-api`](../ai-first-companies-intelligence-api)

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Plain CSS (CSS variables, no UI library) |
| i18n | Custom context — BG default, EN toggle |
| State | React hooks (`useState`, `useEffect`, `useRef`) |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the backend first

The frontend proxies all `/api/*` requests to `http://localhost:3001`. Make sure the API is running before starting the frontend.

```bash
# In the API repo
npm run dev
```

### 3. Run the frontend

```bash
npm run dev
```

Opens at **http://localhost:3000**

## Features

- **Auth** — register (with email confirmation) and login with JWT stored in `localStorage`
- **Upload** — drag-and-drop or file picker for `.csv` / `.xlsx` files with domain lists
- **Batch list** — live progress bar that animates from 0% → 100% as the worker processes companies; polls every 3 seconds while jobs are running
- **Companies modal** — paginated view of enriched company profiles including team members (name, position, email)
- **Export** — download results as CSV or XLSX when a batch completes
- **Delete** — remove a batch and its associated data
- **BG/EN** — full translation of the UI; language persists per session via a toggle button in the header

## Project Structure

```
app/
  layout.tsx          # Root layout with LangProvider
  globals.css         # Design system (CSS variables, all component styles)
  page.tsx            # Auth page (login / register)
  dashboard/
    page.tsx          # Dashboard page

components/
  AuthForm.tsx        # Login + register tabs
  Header.tsx          # Top bar: logo, email, language toggle, logout
  UploadCard.tsx      # Drag-and-drop file upload
  BatchTable.tsx      # Table wrapper with empty/loading states
  BatchRow.tsx        # Single batch row with progress animation
  CompaniesModal.tsx  # Paginated company list with team contacts
  Dashboard.tsx       # Main controller: auth guard, polling, toasts

contexts/
  LangContext.tsx     # BG/EN translations and language toggle

lib/
  api.ts              # Typed API client (proxied to localhost:3001)
  types.ts            # Shared TypeScript types
```

## How the Progress Animation Works

The progress bar counts from 0% to the real completion percentage in real time — it does not jump directly to the final value.

Each `BatchRow` uses a `useRef`-stored timer that increments `displayPct` by 1–2% every 80 ms. When the API poll returns a new (higher) percentage, only the `target` is updated — the timer catches up naturally. When a batch completes, the badge and download buttons appear only after the counter finishes (never "Done at 0%").

## Scripts

```bash
npm run dev     # Development server on port 3000
npm run build   # Production build
npm run start   # Serve production build
```
