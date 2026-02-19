# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Start dev server:** `npm run dev` (nodemon with hot-reload, watches .html/.css/.js)
- **Start production:** `npm start` (node server.js)
- **Port:** defaults to 5050, configurable via `PORT` env var
- No test or lint tooling is configured.

## Architecture

This is a Node.js/Express game hosting platform. The server (`server.js`) serves static game pages and exposes a REST API for user/game session tracking.

### Server & Routing

- `server.js` — Express entry point. Serves `pages/` as static files, defines page routes (`/`, `/matchgame`, `/wemoexplorer`), and mounts API routers.
- `routes/games.js` — `/api/games` endpoints: save/update game sessions (POST), highscores (GET), user game history (GET).
- `routes/users.js` — `/api/users` endpoints: create/update users (POST), list/lookup users (GET), existence check (GET).

### Database

- `db.js` — SQLite3 database layer with Promise-based helpers (`run`, `get`, `all`) plus domain helpers (`upsertUser`, `getUser`, `insertGameSession`, etc.).
- Database file: `data/wemo.db` (gitignored). Tables auto-create on startup.
- Two tables: `users` (userId, name, timestamps) and `games` (sessionId, userId, level, game_time, status, game_name, isMobile, played_at).
- No authentication — users are tracked by client-generated UUID stored in localStorage.

### Games

Each game lives in its own directory under `pages/`:

- **Wemo Explorer** (`pages/wemo/`) — Git submodule ([wemoexplorer repo](https://github.com/life4ants/wemoexplorer)). A tile-based survival/exploration game built with p5.js + Vue 2 + httpVueLoader. Has its own `package.json`. Core scripts are in `pages/wemo/scripts/` (~30 modules: board, man, actions, builder, events, etc.). Vue components loaded dynamically from `pages/wemo/modules/`.
- **Match Game** (`pages/matchgame/`) — Simple memory card matching game in vanilla JS.
- **Conquest & Invasion** — External games, linked out from the home page.

### Key Conventions

- camelCase for variables and function names
- API responses use `{ success: boolean, ... }` envelope pattern
- Game sessions are idempotent via unique `sessionId` (upsert on POST)
- Frontend libraries are vendored in `pages/wemo/lib/` (no CDN)
