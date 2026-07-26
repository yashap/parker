# @parker/drizzle-utils

A small library to make working with [Drizzle](https://orm.drizzle.team/) easier.

## `TransactionManager`

Lets repository methods be written once and composed into a transaction by their caller, without threading a
connection through every signature. `getConnection()` returns the active transaction if there is one, and the
plain connection otherwise.

```ts
import { standardFields, TransactionManager } from '@parker/drizzle-utils'

const users = pgTable('User', {
  ...standardFields, // id (uuid v7 PK), createdAt, updatedAt
  name: varchar({ length: 255 }).notNull(),
})

const db = drizzle({ schema: { users } })

const transactionManager = new TransactionManager(db)

type User = typeof users.$inferSelect

const createUser = async (name: string): Promise<User> => {
  const results = await transactionManager.getConnection().insert(users).values({ name }).returning()
  return results[0]!
}

// Here, both createUser calls run against a single transaction - if the second fails, the first rolls back
const { bob, anne } = await transactionManager.run(async () => {
  const bob = await createUser('Bob')
  const anne = await createUser('Anne')
  return { bob, anne }
})

// Here, the createUser call does not run in a transaction
const sam = await createUser('Sam')
```

## Also exported

- **Column helpers** for types Drizzle doesn't cover natively:
  - `point` (PostGIS `GEOMETRY(POINT,4326)`) and `geomBinaryToPoint` to decode what Postgres returns
  - `instant` (`TIMESTAMP(3) WITH TIME ZONE` ↔ `Temporal.Instant`) and `InstantConfig`
  - `plainTime` (`TIME WITHOUT TIME ZONE` ↔ `Temporal.PlainTime`)
- `standardFields` — the standard `id` + `createdAt` + `updatedAt` columns, as above
- `buildPaginationQuery` — turns a `@parker/pagination` request into Drizzle `where`/`orderBy`/`limit` clauses
- `ActiveTransactionContext` — the `ContextPropagator` that `TransactionManager` uses under the hood
- `DbConnection`, `DbTransaction`, `InputDao` — types

Note the `point`, `instant` and `plainTime` column types are exactly the ones drizzle-kit over-quotes when
generating migrations; see [the parking README](../../backends/parking/README.md) for the workaround.

## Tests

This package has real Postgres-backed tests, run against a throwaway `drizzle_utils` database on the **test**
instance (`:6441`) only. It has its own `drizzle/` migrations generated from a test-only schema
(`src/test/testSchema.ts`), applied by `pnpm --filter @parker/drizzle-utils db:migrate-up:test` — which
`pnpm db:migrate-up:test` at the root does for you.
