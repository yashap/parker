import { relations } from 'drizzle-orm'
import { integer, serial, pgTable, text } from 'drizzle-orm/pg-core'
import { instant } from '../lib/instant'
import { plainTime } from '../lib/plainTime'
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

export const reminders = pgTable('Reminder', {
  id: serial().primaryKey(),
  userId: integer()
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' })
    .notNull(),
  description: text().notNull(),
  time: plainTime().notNull(),
})

export const remindersRelations = relations(reminders, ({ one }) => ({
  user: one(users, {
    fields: [reminders.userId],
    references: [users.id],
  }),
}))
