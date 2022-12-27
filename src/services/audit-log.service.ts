import prisma from '../db/prisma.js'
import { AuditLogAction, AuditLogSearchQuery, AuditLogTarget } from '../types/audit-log.type.js'
import { User } from '../types/user.type.js'

export const auditLog = async (actor: User, action: AuditLogAction, target: AuditLogTarget, data: any, message?: string) => {
    const auditLog = await prisma.audit.create({
        data: {
            name: actor.name,
            email: actor.email,
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
		prisma.audit.findMany({
            skip: query?.skip || 0,
            take: query?.limit || 10,
            where: {
                name: query?.name,
                email: query?.email,
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
