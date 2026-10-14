# Regression tests

| Command | What it runs | Network |
|---|---|---|
| `bun run test` | Unit tests (Vitest): payment verification, webhook signatures, idempotency, pricing/coupons, form validation, canonical URLs | None — Paystack and the database are mocked |
| `BASE_URL=http://localhost:8080 bun run test:smoke` | Read-only HTTP smoke checks against a running site | Local site + read-only course price lookup |
| `BASE_URL=https://lovetechgroup.com.ng bun run test:smoke` | Same checks against the deployed site | Live site |
| `bun run typecheck` | TypeScript check | None |

Smoke tests never sign in, submit forms or start payments. For the price-vs-database check they need
`VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (public values from `.env`); without them that check is skipped.

## Not covered (needs isolated test accounts)
- Signed-in learner vs another learner's records (row-level security) and admin-only actions as a non-admin.
- Full Google sign-in and MCP OAuth flows.
- A real Paystack test-mode charge end to end.
- Successful contact form delivery (would send a real email and write a real row).
