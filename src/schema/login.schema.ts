import { FastifySchema } from 'fastify'

export const loginSchema: FastifySchema = {
    tags: ['Authentication'],
    description: 'Token authentication',
	body: {
		type: 'object',
		required: ['email', 'password'],
		properties: {
			email: {
				type: 'string',
				format: 'email',
			},
			password: { type: 'string' },
		},
	},
}
