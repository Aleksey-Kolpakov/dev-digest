# DevDigest — insights

Durable findings recorded by the `engineering-insights` skill: things that are
true about this code but not visible in it. Append-only — correct a stale entry
with a dated note beneath it rather than editing it away.

This is the **root** file: it holds only findings that cross package boundaries.
Anything scoped to one package lives in that package's file —
[`client`](client/INSIGHTS.md) · [`server`](server/INSIGHTS.md) ·
[`reviewer-core`](reviewer-core/INSIGHTS.md) · [`e2e`](e2e/INSIGHTS.md).

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

- **2026-10-23** — `@devdigest/shared` exists as **two copies**, not one:
  `server/src/vendor/shared/` and `client/src/vendor/shared/` (the client's
  tsconfig alias points at its own copy). They have already drifted —
  `diff -rq server/src/vendor/shared client/src/vendor/shared` lists 5 differing
  files. A contract change made only server-side typechecks on both sides but
  the client never sees the new field. Apply it to both copies, then diff the
  touched file to confirm they match. `client/tsconfig.json:24`

## Tool & Library Notes

_None yet._

## Recurring Errors & Fixes

- **2026-10-23** — running `./scripts/e2e.sh` (`npm run e2e:hermetic`) while
  your own `pnpm dev` is up on :3000 breaks the dev server: the hermetic
  `next dev` on :3100 runs in the same `client/` dir and rewrites the shared
  `client/.next`. Afterwards every hard load on :3000 shows endless skeletons,
  the sidebar says "No repo selected", and the network tab shows
  `_next/static/chunks/app/.../page.js → 404`. Touching the page source does not
  fix it. Stop the dev server, `rm -rf client/.next`, start it again. Stop it
  *before* running the hermetic suite. `scripts/e2e.sh:33`

## Open Questions

_None yet._
