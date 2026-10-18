import type { FastifyRequest } from 'fastify';
import { getAuditLogs } from './audit-logs.service.js';
import type { AuditLogsSearchQuery } from './audit-logs.type.js';

export const getAuditLogsHandler = async (
  request: FastifyRequest<{ Querystring: AuditLogsSearchQuery }>,
) => {
  const { auditLogs, total } = await getAuditLogs(request.query);
  return { data: auditLogs, total };
};
