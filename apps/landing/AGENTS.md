# Agrovia Landing & Frontend Integration Guidelines

## Architecture & Port Allocation
- **Landing Application (`apps/landing`)**: Next.js 16.3 (Turbopack) running on `http://localhost:3000`.
- **Frontend Portal Application (`apps/frontend`)**: React 19 SPA running on `http://localhost:5173`.
- **Backend API (`apps/backend`)**: Express / Bun server running on `http://localhost:4000`.

## Environment Variable Schema
### `apps/landing/.env.local`
```env
NEXT_PUBLIC_APP_URL=http://localhost:5173
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### `apps/frontend/.env`
```env
PORT=5173
VITE_API_URL=http://localhost:4000
VITE_LANDING_URL=http://localhost:3000
```

## Cross-Application Navigation
- **Sign In Buttons**: Must navigate to `${NEXT_PUBLIC_APP_URL}/login`.
- **Book Slot / Register Buttons**: Must navigate to `${NEXT_PUBLIC_APP_URL}/register`.
- **Frontend Portal Home Links**: Point back to `${VITE_LANDING_URL}`.

## UI Design Consistency
- Full-bleed wheat background (`/images/hero-wheat.jpg`) with smooth parallax and subtle ambient gradients.
- Typography: `Plus Jakarta Sans` for clean, modern interfaces and `Newsreader / font-editorial italic` for editorial accent text.
- Color Tokens: Primary dark `#0B2D1B`, Deep background `#06180E`, Accent Lime `#C8F52F`, Surface Warm `#FCFCFA`.
- Portal Roles: **Farmer** (`Sprout` icon) and **Mandi Operator** (`Landmark` icon) only, without emojis.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
