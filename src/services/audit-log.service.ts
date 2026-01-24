import prisma from '../db/prisma.js'
import { Prisma } from '../db/prisma/client.js'
import { AuditActor, type AuditLogActionType, AuditLogSearchQuery, AuditLogTargetType } from '../types/audit-log.type.js'

export const auditLog = async (actor: AuditActor, action: AuditLogActionType, target: AuditLogTargetType, data: object, message?: string) => {
	const auditLog = await prisma.auditLog.create({
		data: {
			name: actor.name,
			username: actor.username,
			impersonated: actor.impersonated,
			action,
			target,
			data,
			message,
		},
	})
	return auditLog
}

export const getAuditLogs = async (query: AuditLogSearchQuery = {}) => {
	const { skip = 0, limit = 10, sort = 'created', order = 'desc', search, ...filters } = query

	const where: Prisma.AuditLogWhereInput = {
		name: { startsWith: filters?.name },
		username: { startsWith: filters?.username },
		impersonated: { contains: filters?.impersonated },
		action: filters?.action,
		target: filters?.target,
		message: { contains: filters?.message },
		created: {
			lte: filters?.endDate,
			gte: filters?.startDate,
		},
	}

	if (search) {
		where.OR = [
			{ name: { contains: search, mode: 'insensitive' } },
			{ username: { contains: search, mode: 'insensitive' } },
			{ impersonated: { contains: search, mode: 'insensitive' } },
			{ message: { contains: search, mode: 'insensitive' } },
		]
	}

	const [auditLogs, total] = await prisma.$transaction([
		prisma.auditLog.findMany({
			where,
			skip,
			take: limit,
			orderBy: { [sort]: order },
		}),
		prisma.auditLog.count({ where }),
	])
	return { auditLogs, total }
}
