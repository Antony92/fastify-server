import { FastifyRequest, FastifyReply } from 'fastify'
import config from '../config.js'
import crypto from 'crypto'
import { getUser } from '../services/user.service.js'

export const loginCallbackHandler = async(request: FastifyRequest, reply: FastifyReply) => {
	const token = await request.server.microsoftOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)
	return token
}

export const loginHandler = async (request: FastifyRequest<{Body: { email: string, password: string }}>, reply: FastifyReply) => {
	const { email, password } = request.body

	const user = await getUser(email)

	if (!user) {
		throw {
			message: `Wrong username or password`,
			error: 'Auth',
			statusCode: 401,
		}
	}
		
	const accessToken = await reply.accessJwtSign(
		{ user },
		{
			jti: crypto.randomUUID(),
		}
	)

	const refreshToken = await reply.refreshJwtSign(
		{ email },
		{
			jti: crypto.randomUUID(),
		}
	)

	reply.cookie(config.cookies.accessCookieName, accessToken, {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		path: '/api',
		expires: new Date(Date.now() + config.cookies.accessCookieExpire),
	})

	reply.cookie(config.cookies.refreshCookieName, refreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		path: '/api/v1/auth/refresh',
		expires: new Date(Date.now() + config.cookies.refreshCookieExpire),
	})

	return { accessToken }
}

export const logoutHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	reply.clearCookie(config.cookies.accessCookieName, { path: '/api' })
	reply.clearCookie(config.cookies.refreshCookieName, { path: '/api/v1/auth/refresh' })
	return { message: 'Logout successful' }
}

export const refreshHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	await request.refreshJwtVerify({ onlyCookie: true })

	const { email } = request.refreshToken

	const user = await getUser(email)

	if (!user)
		throw {
			message: `User does not exist`,
			error: 'Auth',
			statusCode: 401,
		}

	const accessToken = await reply.accessJwtSign(
		{ user },
		{
			jti: crypto.randomUUID(),
		}
	)

	reply.cookie(config.cookies.accessCookieName, accessToken, {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		path: '/api',
		expires: new Date(Date.now() + config.cookies.accessCookieExpire),
	})

	return { accessToken }
}
