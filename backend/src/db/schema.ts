import { pgTable, uuid, varchar, text, timestamp, pgEnum, jsonb } from 'drizzle-orm/pg-core';

export const statusEnum = pgEnum('status', ['OPEN', 'IN_PROGRESS', 'CLOSED']);

export const issues = pgTable('issues', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  status: statusEnum('status').default('OPEN').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const discussions = pgTable('discussions', {
  id: uuid('id').primaryKey().defaultRandom(),
  issueId: uuid('issue_id')
    .references(() => issues.id, { onDelete: 'cascade' })
    .notNull(),
  authorName: varchar('author_name', { length: 255 }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const analyses = pgTable('analyses', {
  id: uuid('id').primaryKey().defaultRandom(),
  issueId: uuid('issue_id')
    .references(() => issues.id, { onDelete: 'cascade' })
    .notNull(),
  summary: text('summary'),
  insights: jsonb('insights'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
