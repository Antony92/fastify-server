import { and, asc, count, desc, eq, getColumns, ilike, or } from 'drizzle-orm';
import db from '../db/index.js';
import { auditLogsTable } from '../db/schema.js';
import type { AuditActor, AuditLogActionType, AuditLogSearchQuery, AuditLogTargetType } from '../types/audit-log.type.js';

export const auditLog = async (actor: AuditActor, action: AuditLogActionType, target: AuditLogTargetType, data: object, message?: string) => {
	const [auditLog] = await db
		.insert(auditLogsTable)
		.values({
			name: actor.name,
			username: actor.username,
			impersonated: actor.impersonated,
			action,
			target,
			data,
			message,
		})
		.returning();
	return auditLog;
};

export const getAuditLogs = async (query: AuditLogSearchQuery = {}) => {
	const { skip = 0, limit = 10, sort = 'created', order = 'desc' } = query;
	const conditions = [];
	if (query.target) conditions.push(eq(auditLogsTable.target, query.target));
	if (query.action) conditions.push(eq(auditLogsTable.action, query.action));
	if (query.message) conditions.push(ilike(auditLogsTable.message, `%${query.message}%`));
	if (query.impersonated) conditions.push(ilike(auditLogsTable.impersonated, `%${query.impersonated}%`));
	if (query.name) conditions.push(ilike(auditLogsTable.name, `${query.name}%`));
	if (query.username) conditions.push(ilike(auditLogsTable.username, `${query.username}%`));
	if (query.search) conditions.push(or(ilike(auditLogsTable.name, `%${query.search}%`), ilike(auditLogsTable.username, `%${query.search}%`)));

	const where = and(...conditions);

	const columns = getColumns(auditLogsTable);
	const orderBy = order === 'desc' ? desc(columns[sort as keyof typeof columns]) : asc(columns[sort as keyof typeof columns]);

	const [auditLogs, [total]] = await Promise.all([
		db.select().from(auditLogsTable).limit(limit).offset(skip).orderBy(orderBy).where(where),
		db.select({ total: count() }).from(auditLogsTable).where(where),
	]);

	return { auditLogs, total };
};
