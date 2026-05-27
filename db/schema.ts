import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  credits: integer("credits").notNull().default(2000),
});

export const repositories = pgTable("repositories", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  repoId: integer("repo_id").notNull(),
  name: text("name").notNull(),
  fullName: text("full_name").notNull(),
  isPrivate: boolean("private").notNull(),
  htmlUrl: text("html_url").notNull(),
  description: text("ddescription"),
  updatedAt: timestamp("updated_at").notNull(),
  owner: text("owner").notNull(),
  language: text("language"),
  default_branch: text("default_branch")
})


export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
