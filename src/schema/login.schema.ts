import { FastifySchema } from 'fastify'

export const loginSchema: FastifySchema = {
    tags: ['Authentication'],
    description: 'Login route',
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