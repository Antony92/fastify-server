import { Role } from '@prisma/client'
import { FastifyPluginAsync } from 'fastify'
import { secured } from '../auth/auth.guard.js'
import { getAuditLogsHandler } from '../controllers/audit.controller.js'
import { getAuditLogsSchema } from '../schema/audit-log.schema.js'

const auditLogRoute: FastifyPluginAsync = async (server) => {
	server.get('/auditLogs', { onRequest: secured([Role.ADMIN]), schema: getAuditLogsSchema }, getAuditLogsHandler)
}

export default auditLogRoute
