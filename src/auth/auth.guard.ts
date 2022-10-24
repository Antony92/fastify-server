import { FastifyRequest, FastifyReply } from 'fastify'
import { UserToken } from '../models/user.model'
import { hasRole } from '../helpers/user.helper'

export const secured = (roles?: string[]) => {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		await request.jwtVerify()
		const inRole = hasRole(request.user, roles)
		if (roles && !inRole) {
			throw {
				message: `Access denied`,
				error: 'Access',
				statusCode: 403,
			}
		}
	}
}

export const trustedApiTokens = (request: FastifyRequest, decodedToken: UserToken) => {
	const denylist = ['token1', 'token2']
	return denylist.includes(decodedToken.jti) ? false : decodedToken
}