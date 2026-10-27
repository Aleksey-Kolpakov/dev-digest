# server (`@devdigest/api`) — agent notes

## Commands

```sh
pnpm dev                                    # tsx watch, :3001
pnpm typecheck                              # tsc --noEmit
pnpm test                                   # everything — needs Docker
pnpm exec vitest run --exclude '**/*.it.test.ts'   # hermetic units only
pnpm exec vitest run .it.test                      # DB-backed only
pnpm db:generate && pnpm db:migrate         # schema change → migration → apply
pnpm db:seed                                # idempotent demo data
```

## Conventions

- One feature = one `src/modules/<name>/` plugin, registered statically in
  `src/modules/index.ts` (one import + one `app.register`).
- Routes declare Zod `params`/`body`/response schemas from `@devdigest/shared`
  via `fastify-type-provider-zod`. Invalid input is rejected with `422` **before**
  the handler runs — never hand-roll `Schema.parse(req.body)`.
- Plugins (helmet, cors, rate-limit, SSE) register **before** modules so the
  encapsulated module plugins inherit them and the shared error handler.
- External I/O goes through an adapter behind the DI container
  (`src/platform/container.ts`) so tests can swap in `src/adapters/mocks.ts`.
- Schema changes: edit `src/db/schema.ts`, then `pnpm db:generate`. Never
  hand-write a migration file.
- Relative imports carry an explicit `.js` extension (ESM). The `export *` barrel
  in `src/db/schema.ts` is the one exception already on disk — do not copy it.
- Tests live in `test/`, and the filename picks the lane: `*.it.test.ts` is
  DB-backed (testcontainers Postgres), everything else must stay hermetic.
- Secrets are read only through `LocalSecretsProvider`
  (`src/adapters/secrets/local.ts`) — `~/.devdigest/secrets.json`, mode 0600,
  with `process.env` as fallback. `GITHUB_TOKEN` canonical, `GITHUB_PAT` accepted.

## Gotchas

- Migrations are **not** applied on boot.
- `loadConfig` marks every secret optional — the server boots with no keys, so a
  missing key surfaces at call time, not at startup.
- The DB schema already contains every table, including ones no starter code
  writes to. An empty table is expected, not a bug.
- Orphaned `running` runs are reaped on boot; a run stuck in `running` is usually
  a crashed process, not a logic bug.

## Do not touch

- `server/clones/**` — cloned user repos, gitignored. Exclude it from every grep
  and glob: it holds a full copy of dev-digest, so you will edit the wrong file.

## Read when

- Read `INSIGHTS.md` first, on every request, for what was already tried
  here, and run the `engineering-insights` skill at the end of the session or
  task to add to it.
- Read `README.md` for the API map and the request/DI flow diagram.
- Read `docs/` for internals beyond `README.md` (run lifecycle, DI container,
  secrets path, SSE, rate limits) and write back there what you had to derive.
- Write a spec to `specs/` before a multi-step server feature; `specs/README.md`
  has the required sections. If it also changes the UI, use `../specs/` instead.
- Read `src/modules/repo-intel/README.md` when touching indexing or the repo map.
- Read `../TESTING.md` before adding a test or changing the unit/integration split.
