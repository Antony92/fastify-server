import { FastifyRequest, FastifyReply } from 'fastify'
import { RefreshToken, AccessToken } from '../types/jwt.type.js'
import { getApiKeyByUserId } from '../services/api-key.service.js'
import { getUserById } from '../services/user.service.js'

export const secured = (roles?: string[]) => {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		await request.accessJwtVerify()
		const user = await getUserById(request.user.id)
		if (user.blocked) {
			throw {
				message: `User is blocked`,
				error: 'Access',
				statusCode: 403,
			}
		}
		if (roles && !user.roles.some(role => roles.includes(role))) {
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
		const apiKeyExist = await getApiKeyByUserId(decodedToken.user.id)
		return apiKeyExist ? decodedToken : false
	}
	return decodedToken
}

export const trustedRefreshTokens = async (request: FastifyRequest, decodedToken: RefreshToken) => {
	return decodedToken
	const allowed = ['token1', 'token2']
	return allowed.includes(decodedToken.jti) ? decodedToken : false
}