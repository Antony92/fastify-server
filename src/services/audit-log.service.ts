import prisma from '../db/prisma.js'
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

export const getAuditLogs = async (query?: AuditLogSearchQuery) => {
	const searchFilter = {}
	if (query?.search) {
		Object.assign(searchFilter, {
			OR: [
				{ name: { contains: query?.search, mode: 'insensitive' } },
				{ username: { contains: query?.search, mode: 'insensitive' } },
				{ impersonated: { contains: query?.search, mode: 'insensitive' } },
				{ message: { contains: query?.search, mode: 'insensitive' } },
			],
		})
	}
	const [auditLogs, total] = await prisma.$transaction([
		prisma.auditLog.findMany({
			skip: query?.skip || 0,
			take: query?.limit || 10,
			where: {
				name: { startsWith: query?.name },
				username: { startsWith: query?.username },
				impersonated: { contains: query?.impersonated },
				action: query?.action,
				target: query?.target,
				message: { contains: query?.message },
				created: {
					lte: query?.endDate,
					gte: query?.startDate,
				},
				...searchFilter,
			},
			orderBy: {
				[query?.sort || 'created']: query?.order || 'desc',
			},
		}),
		prisma.auditLog.count({
			where: {
				name: { startsWith: query?.name },
				username: { startsWith: query?.username },
				impersonated: { contains: query?.impersonated },
				action: query?.action,
				target: query?.target,
				message: { contains: query?.message },
				created: {
					lte: query?.endDate,
					gte: query?.startDate,
				},
				...searchFilter,
			},
		}),
	])
	return { auditLogs, total }
}
