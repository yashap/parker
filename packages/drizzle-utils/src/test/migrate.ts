/**
 * Programmatic migration runner for the drizzle-utils test database. Run via `pnpm db:migrate-up:test`, which sets
 * DATABASE_URL to the dev_admin credentials.
 */
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Pool } from 'pg'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const migrationsFolder = path.resolve(dirname, '../../drizzle')

const databaseUrl = process.env['DATABASE_URL']
if (!databaseUrl) {
  throw new Error('Missing required env var: DATABASE_URL')
}
const pool = new Pool({ connectionString: databaseUrl })
const db = drizzle(pool)

try {
  console.warn(`Running migrations from ${migrationsFolder}`)
  await migrate(db, { migrationsFolder })
  console.warn('Migrations complete')
} finally {
  await pool.end()
}
