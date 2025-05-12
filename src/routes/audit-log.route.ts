import { Role } from '../types/user.type.js'
import type { FastifyPluginAsync } from 'fastify'
import { secured } from '../auth/auth.guard.js'
import { getAuditLogsHandler } from '../controllers/audit.controller.js'
import { getAuditLogsSchema } from '../schema/audit-log.schema.js'


const auditLogRoute: FastifyPluginAsync = async (server) => {
	server.get('/audit-logs', { onRequest: secured([Role.ADMIN]), schema: getAuditLogsSchema }, getAuditLogsHandler)
}

export default auditLogRoute
