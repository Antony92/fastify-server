import { FastifyRequest } from 'fastify'
import { RefreshToken, AccessToken } from '../types/jwt.type.js'
import { getApiKeyByUserId } from '../services/api-key.service.js'
import { getUserById } from '../services/user.service.js'

export const secured = (roles?: string[]) => {
	return async (request: FastifyRequest) => {
		await request.accessJwtVerify()
		const user = await getUserById(request.user.id)
		if (user.blocked) {
			throw {
				message: `User is blocked`,
				error: 'Access',
				statusCode: 403,
			}
		}
		if (roles && !user.roles.some((role) => roles.includes(role))) {
			throw {
				message: `Insufficient roles`,
				error: 'Access',
				statusCode: 403,
			}
		}
	}
}

export const trustedAccessTokens = async (request: FastifyRequest, decodedToken: unknown) => {
	const token = decodedToken as AccessToken
	if (token.api) {
		const apiKeyExist = await getApiKeyByUserId(token.user.id)
		return apiKeyExist ? decodedToken : false
	}
	return decodedToken
}

export const trustedRefreshTokens = async (request: FastifyRequest, decodedToken: unknown) => {
	const token = decodedToken as RefreshToken
	return decodedToken
	const allowed = ['token1', 'token2']
	return allowed.includes(token.jti) ? decodedToken : false
}
