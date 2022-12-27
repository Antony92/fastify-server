import { FastifyRequest, FastifyReply } from 'fastify'
import { RefreshToken, AccessToken } from '../types/jwt.type.js'

export const secured = (roles?: string[]) => {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		await request.accessJwtVerify()
		if (roles && !request.user?.roles?.some((role) => roles.includes(role))) {
			throw {
				message: `Insufficient roles`,
				error: 'Access',
				statusCode: 403,
			}
		}
	}
}

export const trustedAccessTokens = async (request: FastifyRequest, decodedToken: AccessToken) => {
	if (decodedToken.api) {
		// check for api tokens
	}
	return decodedToken
}

export const trustedRefreshTokens = async (request: FastifyRequest, decodedToken: RefreshToken) => {
	return decodedToken
	const allowed = ['token1', 'token2']
	return allowed.includes(decodedToken.jti) ? decodedToken : false
}