import { FastifySchema } from 'fastify'

export const testPostSchema: FastifySchema = {
	tags: ['Test'],
	description: 'Test post',
	body: {
		type: 'object',
		required: ['number'],
		properties: {
			number: { type: 'number' },
			name: { type: 'string' }
		},
	},
}
