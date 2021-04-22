import { FastifySchema } from 'fastify'

export const testSchemaBody: FastifySchema = {
	body: {
		type: 'object',
		required: ['email'],
		properties: {
			email: {
				type: 'string',
				format: 'email',
			},
			number: { type: 'number' },
		},
	},
}
