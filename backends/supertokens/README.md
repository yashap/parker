# supertokens

A local deployment of the [self-hosted SuperTokens core](https://supertokens.com/use-oss), which powers
authentication for Parker. This workspace contains no source code — just the scripts that run the container and
provision its database.

## How it runs

`serve` is a bare `docker run` (there's no docker-compose anywhere in this repo):

```
docker rm -f parker_supertokens && docker run --name parker_supertokens \
  -e POSTGRESQL_USER="supertokens" \
  -e POSTGRESQL_PASSWORD="supertokens_password" \
  -e POSTGRESQL_HOST="host.docker.internal" \
  -e POSTGRESQL_PORT="6440" \
  -e LOG_LEVEL="${LOG_LEVEL:-WARN}" \
  -p 4567:3567 --rm \
  registry.supertokens.io/supertokens/supertokens-postgresql:11.4.5
```

Points worth noting:

- **Port mapping is `4567:3567`** — the core listens on its default `3567` inside the container, and we publish it
  on `4567` on the host. That's the port every backend's `SUPERTOKENS_CORE_URL` default points at.
- **It stores state in the dev Postgres**, reached at `host.docker.internal:6440` (i.e. the `parker_postgres_dev`
  container, via the host). The `supertokens` DB and user are created by `db:up`, which is what
  `pnpm db:migrate-up` invokes for this workspace.
- **The core applies its own schema migrations on startup**, not as part of `pnpm db:migrate-up`. So the dev
  Postgres must already be up before the container starts, or it will fail to boot.
- `--rm` plus the leading `docker rm -f` makes starting idempotent: any previous container is torn down first.
  (On a clean machine you'll see a harmless `Error response from daemon: No such container` from that first
  `docker rm`.)
- `LOG_LEVEL` defaults to `WARN`; set it to `DEBUG` in your shell for verbose core logs.

## Starting it

You rarely start this directly. Both of these bring it up:

```bash
pnpm serve:backend    # all three Fastify services + this container
pnpm serve:user       # a single backend + this container, via a turbo `with` sidecar
```

Each backend's `turbo.json` declares `"with": ["@parker/supertokens#serve"]`, and turbo dedupes it — so exactly
one container starts no matter how many backends are running. Because `with` is a turbo feature, this only
applies when the task runs through turbo; `pnpm --filter @parker/user serve` bypasses turbo and will _not_ start
the container.

## Version pin

Pinned to core **11.4.5**, paired with `supertokens-node` **^23.1.0** in the backends. These majors are coupled:
`supertokens-node` 24 requires core 12, and moving to core 12 needs a staged operator migration, so the upgrade
is deliberately deferred. Bump both together when it happens.

## Scripts

| Command                                                 | What it does                                                            |
| ------------------------------------------------------- | ----------------------------------------------------------------------- |
| `pnpm --filter @parker/supertokens serve`               | Run the core container in the foreground                                |
| `pnpm --filter @parker/supertokens db:up`               | Create the `supertokens` DB + user in the dev Postgres (idempotent)     |
| `pnpm --filter @parker/supertokens db:migrate-up`       | Alias for `db:up` — the core migrates itself on startup                 |
| `pnpm --filter @parker/supertokens db:clean`            | Remove the container and drop the `supertokens` DB + user               |
| `pnpm --filter @parker/supertokens db:dump-fixtures`    | Dump the `supertokens` DB (i.e. your local dev users) to `fixtures.sql` |
| `pnpm --filter @parker/supertokens db:restore-fixtures` | Drop + re-create the DB from `fixtures.sql`                             |
