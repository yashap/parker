import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import { integer, pgTable, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('User', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
})

export type User = typeof users.$inferSelect
export type UserInput = typeof users.$inferInsert
export type TestDbSchema = Record<'users', typeof users>

export class TestDb {
  private static dbSingleton: NodePgDatabase<TestDbSchema> | undefined = undefined

  public static async init() {
    const dbUrl = process.env['DATABASE_URL']
    if (!dbUrl) {
      throw new Error('DATABASE_URL is not set')
    }
    this.dbSingleton = drizzle({
      schema: {
        users,
      },
      connection: {
        connectionString: dbUrl,
      },
    })
    await this.dbSingleton.execute('DROP TABLE IF EXISTS "User"')
    await this.dbSingleton.execute('CREATE TABLE "User" ("id" SERIAL PRIMARY KEY, "name" VARCHAR(255) NOT NULL)')
  }

  public static db(): NodePgDatabase<TestDbSchema> {
    const db = this.dbSingleton
    if (!db) {
      throw new Error('TestDB not initialized (must call init before using)')
    }
    return db
  }

  public static async clear(): Promise<void> {
    await this.db().delete(users)
  }
}
