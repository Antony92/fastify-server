import { Role } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'
import { hasUserRole } from '../services/user.service.js'
import { RefreshToken, AccessToken } from '../types/jwt.type.js'

export const secured = (roles?: Role[]) => {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		await request.accessJwtVerify()
		if (roles && !await hasUserRole(request.user.username, roles)) {
			throw {
				message: `Insufficient roles`,
				error: 'Access',
				statusCode: 403,
			}
		}
	}
}

export const trustedAccessTokens = async (request: FastifyRequest, decodedToken: AccessToken) => {
	return decodedToken
}

export const trustedRefreshTokens = async (request: FastifyRequest, decodedToken: RefreshToken) => {
	return decodedToken
	const allowed = ['token1', 'token2']
	return allowed.includes(decodedToken.jti) ? decodedToken : false
}