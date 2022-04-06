import { FastifyRequest, FastifyReply } from 'fastify'
import { hasRole } from '../helpers/user.helper'

export const secured = (roles?: string[]) => {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		await request.jwtVerify()
		const inRole = hasRole(request.user, roles)
		if (roles && !inRole) {
			reply.status(403).send({
				message: `Access denied`,
				error: 'Access',
				statusCode: 403,
			})
		}
	}
}
