import { JSONSchemaType } from 'ajv'
import { FastifySchema } from 'fastify'
import { ServerEvent } from '../types/server-event.type.js'

export const createServerEventSchema: FastifySchema = {
	tags: ['Server events'],
	description: 'Create server event',
	consumes: ['application/json'],
	produces: ['application/json'],
	body: {
		type: 'object',
		properties: {
			type: { type: 'string', enum: ['info', 'warning', 'danger'] },
			message: { type: 'string' },
		},
		required: ['type', 'message']
	} satisfies JSONSchemaType<ServerEvent>
}