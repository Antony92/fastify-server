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

export const getAuditLogs = async (search?: AuditLogSearchQuery) => {
    const [auditLogs, total] = await prisma.$transaction([
		prisma.audit.findMany({
            skip: search?.skip || 0,
            take: search?.limit || 10,
            where: {
                name: search?.name,
                email: search?.email,
                action: search?.action,
                target: search?.target,
                message: search?.message,
                created: {
                    lte: search?.endDate,
                    gte: search?.startDate,
                }
            }
        }),
		prisma.serverEvent.count()
	])
	return { data: auditLogs, total }    
}
