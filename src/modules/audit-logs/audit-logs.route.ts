import type { FastifyPluginAsync } from 'fastify';
import { secured } from '../auth/auth.guard.js';
import { getAuditLogsHandler } from './audit-logs.controller.js';
import { getAuditLogsSchema } from './audit-logs.schema.js';
import type { AuditLogsSearchQuery } from './audit-logs.type.js';
import { Role } from '../user/user.type.js';

const auditLogRoute: FastifyPluginAsync = async (server) => {
  server.get<{ Querystring: AuditLogsSearchQuery }>(
    '/audit-logs',
    { onRequest: secured([Role.ADMIN]), schema: getAuditLogsSchema },
    getAuditLogsHandler,
  );
};

export default auditLogRoute;
