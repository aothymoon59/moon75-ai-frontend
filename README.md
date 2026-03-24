# Moon75 AI — Frontend

React-based chat interface for the Moon75 AI Agent, built with Vite.

## Quick Start

```bash
npm install
cp .env.example .env    # then edit with your API URL
npm run dev             # → http://localhost:5173
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3001/api` |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `App.jsx` | Main chat interface |
| `/admin` | `AdminPanel.jsx` | Custom Q&A management panel |
| `*` | `NotFound` | 404 error page |

## Key Dependencies

- **React 18** — UI library
- **React Router DOM 6** — Client-side routing
- **React Markdown + remark-gfm** — Markdown rendering with GFM support
- **React Syntax Highlighter** — Code block highlighting (Prism / One Dark)
- **Vite 4** — Build tool and dev server

## Deployment

Pre-configured for **Vercel** via `vercel.json`. Set `VITE_API_URL` as a Vercel environment variable pointing to your deployed backend.
