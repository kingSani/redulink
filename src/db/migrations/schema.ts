import { pgSchema, pgTable, uuid, integer, text, varchar, timestamp, boolean, jsonb, index, foreignKey, primaryKey, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const neonAuth = pgSchema("neon_auth");


export const accountInNeonAuth = neonAuth.table("account", {
	id: uuid().defaultRandom().primaryKey(),
	accountId: text().notNull(),
	providerId: text().notNull(),
	userId: uuid().notNull(),
	accessToken: text(),
	refreshToken: text(),
	idToken: text(),
	accessTokenExpiresAt: timestamp({ withTimezone: true }),
	refreshTokenExpiresAt: timestamp({ withTimezone: true }),
	scope: text(),
	password: text(),
	createdAt: timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ withTimezone: true }).notNull(),
}, (table) => [
	foreignKey({
		columns: [table.userId],
		foreignColumns: [userInNeonAuth.id],
		name: "account_userId_fkey"
	}).onDelete("cascade"),
	index("account_userId_idx").using("btree", table.userId.asc().nullsLast()),
]);

export const invitationInNeonAuth = neonAuth.table("invitation", {
	id: uuid().defaultRandom().primaryKey(),
	organizationId: uuid().notNull(),
	email: text().notNull(),
	role: text(),
	status: text().notNull(),
	expiresAt: timestamp({ withTimezone: true }).notNull(),
	createdAt: timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	inviterId: uuid().notNull(),
}, (table) => [
	foreignKey({
		columns: [table.inviterId],
		foreignColumns: [userInNeonAuth.id],
		name: "invitation_inviterId_fkey"
	}).onDelete("cascade"),
	foreignKey({
		columns: [table.organizationId],
		foreignColumns: [organizationInNeonAuth.id],
		name: "invitation_organizationId_fkey"
	}).onDelete("cascade"),
	index("invitation_email_idx").using("btree", table.email.asc().nullsLast()),
	index("invitation_organizationId_idx").using("btree", table.organizationId.asc().nullsLast()),
]);

export const jwksInNeonAuth = neonAuth.table("jwks", {
	id: uuid().defaultRandom().primaryKey(),
	publicKey: text().notNull(),
	privateKey: text().notNull(),
	createdAt: timestamp({ withTimezone: true }).notNull(),
	expiresAt: timestamp({ withTimezone: true }),
	alg: text(),
	crv: text(),
});

export const memberInNeonAuth = neonAuth.table("member", {
	id: uuid().defaultRandom().primaryKey(),
	organizationId: uuid().notNull(),
	userId: uuid().notNull(),
	role: text().notNull(),
	createdAt: timestamp({ withTimezone: true }).notNull(),
}, (table) => [
	foreignKey({
		columns: [table.organizationId],
		foreignColumns: [organizationInNeonAuth.id],
		name: "member_organizationId_fkey"
	}).onDelete("cascade"),
	foreignKey({
		columns: [table.userId],
		foreignColumns: [userInNeonAuth.id],
		name: "member_userId_fkey"
	}).onDelete("cascade"),
	index("member_organizationId_idx").using("btree", table.organizationId.asc().nullsLast()),
	index("member_userId_idx").using("btree", table.userId.asc().nullsLast()),
]);

export const organizationInNeonAuth = neonAuth.table("organization", {
	id: uuid().defaultRandom().primaryKey(),
	name: text().notNull(),
	slug: text().notNull(),
	logo: text(),
	createdAt: timestamp({ withTimezone: true }).notNull(),
	metadata: text(),
}, (table) => [
	unique("organization_slug_key").on(table.slug),]);

export const projectConfigInNeonAuth = neonAuth.table("project_config", {
	id: uuid().defaultRandom().primaryKey(),
	name: text().notNull(),
	endpointId: text("endpoint_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	trustedOrigins: jsonb("trusted_origins").notNull(),
	socialProviders: jsonb("social_providers").notNull(),
	emailProvider: jsonb("email_provider"),
	emailAndPassword: jsonb("email_and_password"),
	allowLocalhost: boolean("allow_localhost").notNull(),
	pluginConfigs: jsonb("plugin_configs"),
	webhookConfig: jsonb("webhook_config"),
	authLogsExportEnabled: boolean("auth_logs_export_enabled"),
}, (table) => [
	unique("project_config_endpoint_id_key").on(table.endpointId),]);

export const sessionInNeonAuth = neonAuth.table("session", {
	id: uuid().defaultRandom().primaryKey(),
	expiresAt: timestamp({ withTimezone: true }).notNull(),
	token: text().notNull(),
	createdAt: timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ withTimezone: true }).notNull(),
	ipAddress: text(),
	userAgent: text(),
	userId: uuid().notNull(),
	impersonatedBy: text(),
	activeOrganizationId: text(),
}, (table) => [
	foreignKey({
		columns: [table.userId],
		foreignColumns: [userInNeonAuth.id],
		name: "session_userId_fkey"
	}).onDelete("cascade"),
	index("session_userId_idx").using("btree", table.userId.asc().nullsLast()),
	unique("session_token_key").on(table.token),]);

export const userInNeonAuth = neonAuth.table("user", {
	id: uuid().defaultRandom().primaryKey(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean().notNull(),
	image: text(),
	createdAt: timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	role: text(),
	banned: boolean(),
	banReason: text(),
	banExpires: timestamp({ withTimezone: true }),
}, (table) => [
	unique("user_email_key").on(table.email),]);

export const verificationInNeonAuth = neonAuth.table("verification", {
	id: uuid().defaultRandom().primaryKey(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp({ withTimezone: true }).notNull(),
	createdAt: timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("verification_identifier_idx").using("btree", table.identifier.asc().nullsLast()),
]);

export const clicks = pgTable("clicks", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	linkId: integer().notNull().references(() => links.id, { onDelete: "cascade" } ),
	userAgent: text("user_agent").notNull(),
	referrer: text(),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const links = pgTable("links", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	url: text().notNull(),
	code: text().notNull(),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
}, (table) => [
	unique("links_code_key").on(table.code),]);

export const users = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar().notNull(),
	email: varchar().notNull(),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
}, (table) => [
	unique("users_email_key").on(table.email),]);
