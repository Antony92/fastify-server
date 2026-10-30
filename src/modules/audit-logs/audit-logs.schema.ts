import type { FastifySchema } from 'fastify';
import { Type } from 'typebox';
import { paginationQuerySchema } from '../../schemas/request.schema.js';

export const auditLogsSearchQueryShema = Type.Intersect([
  paginationQuerySchema,
  Type.Object({
    name: Type.Optional(Type.String()),
    username: Type.Optional(Type.String()),
    impersonated: Type.Optional(Type.String()),
    action: Type.Optional(Type.String()),
    target: Type.Optional(Type.String()),
    message: Type.Optional(Type.String()),
    startDate: Type.Optional(Type.String()),
    endDate: Type.Optional(Type.String()),
  }),
]);

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
