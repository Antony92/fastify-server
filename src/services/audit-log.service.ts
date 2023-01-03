import prisma from '../db/prisma.js'
import { AuditLogAction, AuditLogSearchQuery, AuditLogTarget } from '../types/audit-log.type.js'
import { UserJWT } from '../types/user.type.js'

export const auditLog = async (actor: UserJWT, action: AuditLogAction, target: AuditLogTarget, data: object, message?: string) => {
    const auditLog = await prisma.auditLog.create({
        data: {
            name: actor.name,
            username: actor.username,
            action,
            target,
            data,
            message
        }
    })
    return auditLog
}

export const getAuditLogs = async (query?: AuditLogSearchQuery) => {
    const [auditLogs, total] = await prisma.$transaction([
		prisma.auditLog.findMany({
            skip: query?.skip || 0,
            take: query?.limit || 10,
            where: {
                name: query?.name,
                username: query?.username,
                action: query?.action,
                target: query?.target,
                message: query?.message,
                created: {
                    lte: query?.endDate,
                    gte: query?.startDate,
                }
            }
        }),
		prisma.serverEvent.count()
	])
	return { data: auditLogs, total }    
}
