import { FastifySchema } from 'fastify'

export const loginSchema: FastifySchema = {
    tags: ['Authentication'],
    description: 'Login route',
	consumes: ['application/json'],
	produces: ['application/json'],
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

export const logoutSchema: FastifySchema = {
	tags: ['Authentication'],
    description: 'Logout route',
}