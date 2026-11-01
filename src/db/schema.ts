import * as p from "drizzle-orm/pg-core";

export const usersTable = p.pgTable("users", {
  id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: p.varchar().notNull(),
  email: p.varchar().notNull().unique(),
  createdAt: p.timestamp("created_at").defaultNow().notNull(),
});
export const linksTable = p.pgTable("links", {
  id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
  // userId: p
  //   .integer()
  //   .notNull()
  //   .references(() => usersTable.id, { onDelete: "cascade" }),
  url: p.text("url").notNull(),
  code: p.text("code").notNull().unique(),
  createdAt: p.timestamp("created_at").defaultNow().notNull(),
});
export const clicksTable = p.pgTable("clicks", {
  id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
  linkId: p
    .integer()
    .notNull()
    .references(() => linksTable.id, { onDelete: "cascade" }),
  userAgent: p.text("user_agent").notNull(),
  referrer: p.text("referrer"),
  createdAt: p.timestamp("created_at").defaultNow().notNull(),
});
