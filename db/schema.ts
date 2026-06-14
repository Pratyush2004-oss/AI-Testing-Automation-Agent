import { boolean, integer, jsonb, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  credits: integer("credits").notNull().default(2000),
});

export const creditPurchases = pgTable("credit_purchases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  stripeSessionId: text("stripe_session_id").notNull().unique(),
  packageId: text("package_id").notNull(),
  credits: integer("credits").notNull(),
  amountCents: integer("amount_cents").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const repositories = pgTable("repositories", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  repoId: integer("repo_id").notNull(),
  name: text("name").notNull(),
  fullName: text("full_name").notNull(),
  isPrivate: boolean("private").notNull(),
  htmlUrl: text("html_url").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").notNull(),
  owner: text("owner").notNull(),
  language: text("language"),
  default_branch: text("default_branch"),
  targetDomain: varchar("domain", { length: 255 }).default("http://localhost:3000"),
  globalInstructions: varchar("globalInstructions", { length: 255 }).default("None"),
})

export const TestCaseTable = pgTable("testcases", {
  id: serial("id").primaryKey(),
  // repo / project details
  userId: integer("user_id").references(() => users.id).notNull(),
  repoId: integer("repo_id").notNull(),
  repoName: varchar("repoName", { length: 255 }).notNull(),
  repoOwner: varchar("repo_owner", { length: 255 }).notNull(),
  branch: varchar("branch", { length: 100 }).notNull().default("main"),
  // main test cases data
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  priority: varchar("priority", { length: 100 }).notNull(),

  // important metadata for second step: BrowserBase script generation
  targetRoute: varchar("target_route", { length: 500 }),
  targetFiles: jsonb("target_files").$type<string[]>().default([]),
  expectedResult: jsonb("expected_result"),

  browserbaseScript: text("browserbase_script"),
  status: varchar("status", { length: 100 }).notNull().default("generated"),
  createdAt: timestamp("created_at").defaultNow().notNull(),

  // domain name
  targetDomain: varchar("domain", { length: 255 }).default("http://localhost:3000"),
  logs: text("logs").array().$type<string[]>().default([]),
  sessionId: varchar("session_id", { length: 255 }),
  sessionUrl: varchar("session_url", { length: 255 }),
})

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
