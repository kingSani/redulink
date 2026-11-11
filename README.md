# Redulink

A URL shortener built with Next.js, Postgres (Neon) and Drizzle ORM. Paste a long link, get a short one, and every visit is recorded as a click for analytics.

**Live demo: [redulink.vercel.app](https://redulink.vercel.app)**



## Features

- **Shorten links**: submit a URL and get back an 8-character [nanoid](https://github.com/ai/nanoid) short code.
- **Redirects**: `/<code>` looks up the destination and redirects with a `307`.
- **Click tracking**: each visit stores the user agent and the referrer's hostname. The write happens in `after()`, so it never slows down the redirect or breaks it if logging fails.
- **Destination validation** with Zod:
  - must be a valid `http` or `https` URL, with no embedded credentials
  - blocks `localhost`, `.local`, `.internal` and similar hostnames
  - resolves DNS and rejects anything that isn't a public unicast IP (private, loopback and link-local ranges), which guards against SSRF-style abuse
- **Collision handling**: if a generated code already exists (Postgres unique violation `23505`), it retries up to 5 times before failing gracefully.
- **Authentication** with Neon Auth (email and password sign-up and sign-in). Routes under `/account` are protected by middleware.

## Design decisions

- **Non-blocking analytics.** Click logging runs in `after()`, so the redirect returns immediately and a failed insert can never break a link.
- **SSRF protection.** Validation resolves DNS and only accepts public unicast addresses, so the shortener can't be pointed at internal or loopback targets.
- **Collision-safe codes.** Instead of checking whether a code exists first (a race condition), the insert relies on the database's unique constraint and retries on violation `23505`.
- **Server Actions with typed form state.** Validation errors and success results come back through a discriminated `FormState` type, so the UI handles each case without guesswork.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Actions, Cache Components) |
| UI | React 19, Tailwind CSS 4, lucide-react |
| Database | Postgres on [Neon](https://neon.tech) via `@neondatabase/serverless` |
| ORM / migrations | Drizzle ORM and drizzle-kit |
| Auth | Neon Auth (`@neon/auth`) |
| Validation | Zod 4, ipaddr.js |
| Language | TypeScript |

## Getting started

### Prerequisites

- Node.js 20+
- A Neon project with Neon Auth enabled

### 1. Install

```bash
git clone https://github.com/kingSani/redulink.git
cd redulink
npm install
```

### 2. Configure environment

Create a `.env.local` in the project root:

```bash
# Neon Postgres connection string
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Neon Auth
NEON_AUTH_BASE_URL="https://your-neon-auth-url"
NEON_AUTH_COOKIE_SECRET="a-long-random-string"
```

Generate a cookie secret with `openssl rand -base64 32`.

### 3. Set up the database

```bash
npx drizzle-kit migrate
```

This applies the migrations in `src/db/migrations`. Drizzle reads `DATABASE_URL` from `.env.local` (see `drizzle.config.ts`).

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
├── app/
│   ├── [code]/route.ts      # Redirect handler + click logging
│   ├── actions.ts           # shortenLink server action
│   ├── page.tsx             # Home page with the shorten form
│   ├── auth/                # Sign-in and sign-up pages + actions
│   └── api/auth/[...path]/  # Neon Auth route handler
├── db/
│   ├── schema.ts            # links and clicks tables
│   ├── index.ts             # Drizzle + Neon client
│   └── migrations/
└── lib/
    ├── auth/                # Server and client auth helpers
    └── schemas/link.ts      # URL validation (Zod + SSRF checks)
proxy.ts                     # Auth middleware for /account/*
drizzle.config.ts
```

## Data model

- **links**: `id`, `user_id` (nullable, references the Neon Auth user, cascade delete), `url`, `code` (unique), `created_at`
- **clicks**: `id`, `link_id` (references links, cascade delete), `user_agent`, `referrer`, `created_at`

## Roadmap

- [ ] Attach new links to the signed-in user
- [ ] `/account` dashboard listing a user's links
- [ ] Per-link analytics (clicks over time, top referrers)
- [ ] Copy-to-clipboard and QR code for short links
- [ ] Rate limiting on link creation
- [ ] Custom aliases and link expiry

## Deployment

Deploy on [Vercel](https://vercel.com/new). Add the three environment variables above in the project settings, and run `npx drizzle-kit migrate` against your production database.

## Author

Built by [Ahmed Galadima Sani](https://github.com/kingSani).
