# server — insights

Durable findings recorded by the `engineering-insights` skill: things that are
true about this code but not visible in it. Append-only — correct a stale entry
with a dated note beneath it rather than editing it away.

The seven sections below are fixed and identical in every file; never invent a
new heading. The `engineering-insights` skill holds the entry format, the quality
bar, and which section a finding belongs in.

## Decisions

_None yet._

## What Works

_None yet._

## What Doesn't Work

_None yet._

## Codebase Patterns

_None yet._

## Tool & Library Notes

_None yet._

## Recurring Errors & Fixes

- **2026-10-23** — in `test/integration.it.test.ts`, `seed()` already writes
  reviews with findings (`created_at` = now) on the first imported PR, so a test
  that inserts its own reviews and asserts "latest review/batch" gets the seed's
  findings mixed in ("Hardcoded Stripe secret key in commit" shows up). Insert
  test reviews with `createdAt` an hour in the future so they are unambiguously
  newest. `server/test/integration.it.test.ts:146`

- **2026-10-23** — `pnpm dev` dies at startup with `ZodError … Invalid enum
  value. Expected 'fatal' | 'error' | … received ''` on `path: [ 'LOG_LEVEL' ]`.
  `.env.example` ships `LOG_LEVEL=` empty, dotenv loads it as `''`, and `''` is
  not a member of the `.optional()` enum — `.optional()` only accepts
  `undefined`. `dev.sh` still prints `✓ Ready` for Next on :3000, so only the
  missing :3001 shows it. Branches cut from the lesson labs (`master`) lack
  `main`'s fix, a `z.preprocess` mapping `''` → `undefined`. Local workaround:
  set `LOG_LEVEL=info` in the gitignored `server/.env`.
  `server/src/platform/config.ts:33`

## Open Questions

_None yet._
