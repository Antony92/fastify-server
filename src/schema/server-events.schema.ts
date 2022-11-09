import { FastifySchema } from 'fastify'

export const createServerEventSchema: FastifySchema = {
	tags: ['Server events'],
	description: 'Create server event',
	consumes: ['application/json'],
	produces: ['application/json'],
	body: {
		type: 'object',
		required: ['type', 'message'],
		properties: {
			type: { type: 'string', enum: ['info', 'warning', 'danger'] },
			message: { type: 'string', maxLength: 500 },
		},
	},
}
