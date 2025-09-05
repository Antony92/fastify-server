import { FastifyRequest } from 'fastify'
import { getAuditLogs } from '../services/audit-log.service.js'
import { AuditLogSearchQuery } from '../types/audit-log.type.js'

export const getAuditLogsHandler = async (request: FastifyRequest<{ Querystring: AuditLogSearchQuery }>) => {
	const { auditLogs, total } = await getAuditLogs(request.query)
	return { data: auditLogs, total }
}
