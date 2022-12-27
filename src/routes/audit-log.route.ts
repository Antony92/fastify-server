import { FastifyInstance } from 'fastify'
import { secured } from '../auth/auth.guard.js'
import { getAuditLogsHandler } from '../controllers/audit.controller.js'
import { getAuditLogsSchema } from '../schema/audit-log.schema.js'
import { Roles } from '../types/user.type.js'

const auditLogRoute = async (server: FastifyInstance) => {
	server.get('/auditLogs', { onRequest: secured([Roles.ADMIN]), schema: getAuditLogsSchema }, getAuditLogsHandler)
}

export default auditLogRoute
