# Insights — client

UI decisions and dead ends. Read before restructuring pages, state, or the data
layer.

Read at the start of a task, written at the end of one, by the
`engineering-insights` skill. Append-only — correct a stale entry with a dated
note beneath it rather than editing it away.

The seven sections below are fixed and identical in every file; never invent a
new heading. The `engineering-insights` skill holds the entry format, the quality
bar, and which section a finding belongs in. Cross-package findings go to the
root [`INSIGHTS.md`](../INSIGHTS.md) instead.

## Decisions

_None yet._

## What Works

- **2026-10-23** — to eyeball a UI state the dev DB lacks (e.g. a PR whose
  reviews have findings) without writing rows or paying for an LLM run:
  hard-load some *other* route (`/agents`), override `window.fetch` in the page
  to rewrite the response you need, then `window.next.router.push(<target>)`.
  Patching on the target page itself does nothing: the query is already cached,
  `refetchOnWindowFocus` is off and `staleTime` is 30s
  (`client/src/lib/providers.tsx:28`), and any hard navigation drops the patch.

## What Doesn't Work

_None yet._

## Codebase Patterns

_None yet._

## Tool & Library Notes

- **2026-10-23** — `client/CLAUDE.md` lists `pnpm lint` (eslint,
  exhaustive-deps as error), but `client/package.json` has no `lint` script and
  no eslint dependency or config: `pnpm lint` fails with `Command "lint" not
  found`. The working gate is `pnpm typecheck && pnpm test`. Existing
  `// eslint-disable-next-line react-hooks/exhaustive-deps` comments are inert.
  `client/package.json:5`

## Recurring Errors & Fixes

_None yet._

## Open Questions

_None yet._
