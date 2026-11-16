# ALL IN ONE — Streaming Bundle Demo

A responsive, English-language MVP for exploring a proposed streaming bundle in Kuwait. The demo includes Netflix, HBO Max, OSN, Shahid, and Hulu.

## Demo behavior

- The three-month demo offer is KWD 2 total for new ALL IN ONE customers and KWD 4 total for returning customers.
- KNET checkout is simulated locally. It does not charge money, collect card details, or activate streaming access.
- Guests can browse and use the demo without creating an account. Guest data stays in that browser.
- Signed-in account data is stored server-side in Supabase. The service-role key is used by the API server only.
- Each streaming service has a poster gallery with original illustrative artwork. Titles are examples, not a live regional catalog, and videos cannot be played in the demo.

Platform names are shown for the proposed bundle only. This demo does not claim affiliation with or access to third-party streaming accounts.

## Run in Replit

The workspace uses Node.js 24 and pnpm. Replit's configured workflows start the web app and API server:

```sh
pnpm --filter @workspace/sahhelha run dev
pnpm --filter @workspace/api-server run dev
```

Run the workspace checks with:

```sh
pnpm run typecheck
```

## Required configuration

Set secrets through Replit Secrets; never commit their values:

- `CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `VITE_CLERK_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — API server only; never expose it to browser code
- `OPENAI_API_KEY` — optional, for AI login help

`SUPABASE_URL` is a project URL, not a credential. `DATABASE_URL` is managed by Replit for the existing database and should not be committed.

## Supabase data

The app uses the isolated `public.all_in_one_user_data` table. Row-level security is enabled and direct access for `anon` and `authenticated` roles is revoked. The authenticated API server derives the Clerk user ID from the verified session and does not accept an owner ID from the request body.

The SQL migration is in `supabase/migrations/`. Existing Supabase market/store tables and legacy Replit database records are left untouched.
