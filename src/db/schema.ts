import { defineRelations, sql } from 'drizzle-orm';
import { boolean, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const rolesEnum = pgEnum('user_role', ['admin', 'guest']);
export const serverEventTypesEnum = pgEnum('server_event_type', ['info', 'warning', 'error']);

export const usersTable = pgTable('users', {
	id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
	name: text().notNull(),
	username: text().notNull().unique(),
	roles: text('roles').array().default(['guest']).notNull(),
	active: boolean().default(true),
	blocked: boolean().default(false),
	internal: boolean().default(false),
	created: timestamp().defaultNow(),
	updated: timestamp(),
	lastLogin: timestamp(),
});

export const apiKeysTable = pgTable('api_keys', {
	id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
	jti: text().notNull().unique(),
	jwt: text().unique(),
	created: timestamp().defaultNow(),
	userId: uuid('user_id').references(() => usersTable.id, { onDelete: 'cascade' }),
});

export const auditLogsTable = pgTable('audit_logs', {
	id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
	username: text().notNull(),
	name: text().notNull(),
	action: text().notNull(),
	target: text().notNull(),
	data: jsonb(),
	message: text(),
	impersonated: text(),
	created: timestamp().defaultNow(),
});

export const serverEventsTable = pgTable('server_events', {
	id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
	type: serverEventTypesEnum('type').default('info').notNull(),
	message: text().notNull(),
	created: timestamp().defaultNow(),
	updated: timestamp(),
});

export const feedbackTable = pgTable('feedback', {
	id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
	email: text().notNull(),
	name: text().notNull(),
	satisfaction: integer(),
	message: text().notNull(),
	created: timestamp().defaultNow(),
});

export const relations = defineRelations({ usersTable, apiKeysTable, serverEventsTable }, (r) => ({
	usersTable: {
		apiKeys: r.one.apiKeysTable({
			from: r.usersTable.id,
			to: r.apiKeysTable.userId,
		}),
	},
}));
