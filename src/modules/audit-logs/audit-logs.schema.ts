import type { FastifySchema } from 'fastify';
import { auditLogsSearchQueryShema } from './audit-logs.type.js';

export const getAuditLogsSchema: FastifySchema = {
  tags: ['Audit logs'],
  description: 'Get audit logs',
  consumes: ['application/json'],
  produces: ['application/json'],
  security: [
    {
      bearerAuth: [],
    },
  ],
  querystring: auditLogsSearchQueryShema,
};
