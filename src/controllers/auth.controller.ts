import { FastifyRequest, FastifyReply } from 'fastify'
import config from '../config.js'
import crypto from 'crypto'
import { createUser, getUser } from '../services/user.service.js'

export const loginCallbackHandler = async(request: FastifyRequest, reply: FastifyReply) => {
	const token = await request.server.microsoftOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)

	const { upn: email, name } = JSON.parse(Buffer.from(token.token.access_token.split('.')[1], 'base64').toString())

	const user = await createUser({
		email,
		name,
	})
		
	const accessToken = await reply.accessJwtSign(
		{ 
			user: {
				name: user.name,
				email: user.email,
				roles: user.roles
			}  
		},
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

	reply.cookie(config.cookies.refreshCookieName, refreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		path: '/api/v1/auth/refresh',
		expires: new Date(Date.now() + config.cookies.refreshCookieExpire),
	})

	reply.redirect(302, `/login?token=${accessToken}`)

	return reply
}


export const logoutHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	reply.clearCookie(config.cookies.refreshCookieName, { path: '/api/v1/auth/refresh' })

	return { message: 'Logout successful' }
}

export const refreshHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	await request.refreshJwtVerify({ onlyCookie: true })

	const { email } = request.refreshToken

	const user = await getUser(email)
	if (!user) {
		throw {
			message: `User does not exist`,
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

	return { accessToken }
}
