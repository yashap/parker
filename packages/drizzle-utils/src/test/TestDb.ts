import { relations } from 'drizzle-orm'
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import { integer, serial, pgTable, text } from 'drizzle-orm/pg-core'
import { Pool } from 'pg'
import { instant } from '../lib/instant'
import { point } from '../lib/point'

export const users = pgTable('User', {
  id: serial().primaryKey(),
  name: text().notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  favouriteLocations: many(favouriteLocations),
}))

export const posts = pgTable('Post', {
  id: serial().primaryKey(),
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

export const favouriteLocations = pgTable('FavouriteLocation', {
  id: serial().primaryKey(),
  userId: integer()
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' })
    .notNull(),
  name: text().notNull(),
  location: point().notNull(),
})

export const favouriteLocationsRelations = relations(favouriteLocations, ({ one }) => ({
  user: one(users, {
    fields: [favouriteLocations.userId],
    references: [users.id],
  }),
}))

const schema = {
  users,
  usersRelations,
  posts,
  postsRelations,
  favouriteLocations,
  favouriteLocationsRelations,
}

export type TestDbSchema = typeof schema

export type User = typeof users.$inferSelect
export type UserInput = typeof users.$inferInsert

export type Post = typeof posts.$inferSelect
export type PostInput = typeof posts.$inferInsert

export type FavouriteLocation = typeof favouriteLocations.$inferSelect
export type FavouriteLocationInput = typeof favouriteLocations.$inferInsert

export class TestDb {
  private static dbSingleton: NodePgDatabase<TestDbSchema> | undefined = undefined

  public static async init() {
    const dbUrl = process.env['DATABASE_URL']
    if (!dbUrl) {
      throw new Error('DATABASE_URL is not set')
    }
    this.dbSingleton = drizzle(
      new Pool({
        connectionString: dbUrl,
      }),
      {
        schema,
      }
    )

    /**
     * Would normally use drizzle-kit migrations for this sort of thing, but for tests, this works better
     */
    await this.dbSingleton.execute('CREATE EXTENSION IF NOT EXISTS "postgis"')
    await this.dbSingleton.execute('DROP TABLE IF EXISTS "Post"')
    await this.dbSingleton.execute('DROP TABLE IF EXISTS "FavouriteLocation"')
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
    await this.dbSingleton.execute(`
      CREATE TABLE "FavouriteLocation" (
        "id" SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "name" TEXT NOT NULL,
        "location" GEOMETRY(POINT, 4326) NOT NULL
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
