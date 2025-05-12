import type { FastifyRequest } from 'fastify'
import { getAuditLogs } from '../services/audit-log.service.js'
import type { AuditLogSearchQuery } from '../types/audit-log.type.js'

export const getAuditLogsHandler = async (request: FastifyRequest) => {
	const { auditLogs, total } = await getAuditLogs(request.query as AuditLogSearchQuery)
	return { data: auditLogs, total }
}
