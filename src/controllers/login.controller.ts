import { FastifyRequest, FastifyReply } from 'fastify'
import config from '../config'
import crypto from 'crypto'
import { RefreshTokenRequest } from 'src/types/request.type'

export const loginCallbackHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	const providerToken = await request.server.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)
	const token = await reply.jwtSign({
		jti: crypto.randomUUID(),
	})
	reply.cookie(config.cookie.name, token, {
		httpOnly: true,
		secure: true,
		sameSite: true,
		path: '/',
		expires: new Date(Date.now() + config.cookie.expire),
	})
	return { token, refreshToken: providerToken.token }
}

export const loginRefreshHandler = async (request: FastifyRequest<RefreshTokenRequest>, reply: FastifyReply) => {
	const { refreshToken } = request.body
	const providerToken = await request.server.googleOAuth2.getNewAccessTokenUsingRefreshToken(refreshToken, null)
	const token = await reply.jwtSign({
		jti: crypto.randomUUID(),
	})
	reply.cookie(config.cookie.name, token, {
		httpOnly: true,
		secure: true,
		sameSite: true,
		path: '/',
		expires: new Date(Date.now() + config.cookie.expire),
	})
	return { token, refreshToken: providerToken }
}

export const logoutHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	reply.clearCookie(config.cookie.name)
	return { message: 'Logout successful' }
}
