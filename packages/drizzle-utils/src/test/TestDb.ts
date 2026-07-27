import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '../test/testSchema.js'

export type TestDbSchema = typeof schema

export type User = typeof schema.userTable.$inferSelect
export type UserInput = typeof schema.userTable.$inferInsert

export type Post = typeof schema.postTable.$inferSelect
export type PostInput = typeof schema.postTable.$inferInsert

export type FavouriteLocation = typeof schema.favouriteLocationTable.$inferSelect
export type FavouriteLocationInput = typeof schema.favouriteLocationTable.$inferInsert

export type Reminder = typeof schema.reminderTable.$inferSelect
export type ReminderInput = typeof schema.reminderTable.$inferInsert

export class TestDb {
  private static pool: Pool | undefined = undefined
  private static dbSingleton: NodePgDatabase<TestDbSchema> | undefined = undefined

  public static async init() {
    const dbUrl = process.env['DATABASE_URL']
    if (!dbUrl) {
      throw new Error('DATABASE_URL is not set')
    }
    this.pool = new Pool({
      connectionString: dbUrl,
    })
    this.dbSingleton = drizzle(this.pool, {
      schema,
    })
  }

  public static db(): NodePgDatabase<TestDbSchema> {
    const db = this.dbSingleton
    if (!db) {
      throw new Error('TestDB not initialized (must call init before using)')
    }
    return db
  }

  public static async clear(): Promise<void> {
    await this.db().delete(schema.userTable)
  }

  /**
   * Ends the underlying connection pool - the TestDb cannot be used after this is called (without calling init
   * again). Tests must close the pool for the test process to exit cleanly.
   */
  public static async close(): Promise<void> {
    await this.pool?.end()
    this.pool = undefined
    this.dbSingleton = undefined
  }
}
