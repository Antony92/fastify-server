import { Role } from '../types/user.type.js'
import { FastifyPluginAsync } from 'fastify'
import { secured } from '../auth/auth.guard.js'
import { getAuditLogsHandler } from '../controllers/audit.controller.js'
import { getAuditLogsSchema } from '../schema/audit-log.schema.js'
import { AuditLogSearchQuery } from '../types/audit-log.type.js'


const auditLogRoute: FastifyPluginAsync = async (server) => {
	server.get<{ Querystring: AuditLogSearchQuery }>('/audit-logs', { onRequest: secured([Role.ADMIN]), schema: getAuditLogsSchema }, getAuditLogsHandler)
}

export default auditLogRoute
