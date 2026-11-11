import * as p from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
export const neonAuth = p.pgSchema("neon_auth");

export const userInNeonAuth = neonAuth.table("user", {
  id: p.uuid("id").defaultRandom().primaryKey().notNull(),
  name: p.text("name").notNull(),
  email: p.text("email").notNull(),
  emailVerified: p.boolean("emailVerified").notNull(),

  createdAt: p
    .timestamp("createdAt", { withTimezone: true, mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: p
    .timestamp("updatedAt", { withTimezone: true, mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const linksTable = p.pgTable("links", {
  id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: p
    .uuid()

    .references(() => userInNeonAuth.id, { onDelete: "cascade" }),
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
