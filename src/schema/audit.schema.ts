import { JSONSchemaType } from 'ajv'
import { FastifySchema } from 'fastify'
import { AuditLogSearchQuery } from '../types/audit-log.type.js'

export const getAuditLogsSchema: FastifySchema = {
	tags: ['Audit log'],
	description: 'Get audit logs',
	consumes: ['application/json'],
	produces: ['application/json'],
	querystring: {
		type: 'object',
		properties: {
			skip: { type: 'number', nullable: true, minimum: 0 },
			limit: { type: 'number', nullable: true, default: 10, maximum: 50 },
            name: { type: 'string', nullable: true },
            email: { type: 'string', nullable: true },
            action: { type: 'string', nullable: true },
            target: { type: 'string', nullable: true },
            message: { type: 'string', nullable: true },
            startDate: { type: 'string', nullable: true },
            endDate: { type: 'string', nullable: true },
		}
	} satisfies JSONSchemaType<AuditLogSearchQuery>
}