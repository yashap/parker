import { relations } from 'drizzle-orm'
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import { integer, pgTable, text } from 'drizzle-orm/pg-core'
import { instant } from '../lib/instant'

export const users = pgTable('User', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}))

export const posts = pgTable('Post', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  authorId: integer()
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' })
    .notNull(),
  message: text().notNull(),
  sentAt: instant().notNull(),
})

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}))

const schema = {
  users,
  usersRelations,
  posts,
  postsRelations,
}

export type TestDbSchema = typeof schema

export type User = typeof users.$inferSelect
export type UserInput = typeof users.$inferInsert

export type Post = typeof posts.$inferSelect
export type PostInput = typeof posts.$inferInsert

export class TestDb {
  private static dbSingleton: NodePgDatabase<TestDbSchema> | undefined = undefined

  public static async init() {
    const dbUrl = process.env['DATABASE_URL']
    if (!dbUrl) {
      throw new Error('DATABASE_URL is not set')
    }
    this.dbSingleton = drizzle({
      schema,
      connection: {
        connectionString: dbUrl,
      },
    })

    /**
     * Would normally use drizzle-kit migrations for this sort of thing, but for tests, this works better
     */
    await this.dbSingleton.execute('DROP TABLE IF EXISTS "Post"')
    await this.dbSingleton.execute('DROP TABLE IF EXISTS "User"')
    await this.dbSingleton.execute(`
      CREATE TABLE "User" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL
      )
    `)
    await this.dbSingleton.execute(`
      CREATE TABLE "Post" (
        "id" SERIAL PRIMARY KEY,
        "authorId" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "message" TEXT NOT NULL,
        "sentAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL
      )
    `)
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
