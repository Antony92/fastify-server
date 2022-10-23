import { FastifySchema } from 'fastify'

export const logoutSchema: FastifySchema = {
	tags: ['Authentication'],
    description: 'Logout route',
}