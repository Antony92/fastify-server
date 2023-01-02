import { FastifyRequest, FastifyReply } from 'fastify'
import config from '../config.js'
import { createUser, getUserByUsername } from '../services/user.service.js'

export const loginCallbackHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	const token = await request.server.microsoftOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)

	const { upn: username, name } = JSON.parse(Buffer.from(token.token.access_token.split('.')[1], 'base64').toString())

	const user = await createUser({
		username,
		name,
	})

	const accessToken = await reply.accessJwtSign(
		{
			user: {
				id: user.id,
				name: user.name,
				username: user.username,
				roles: user.roles,
			},
		},
		{
			expiresIn: config.jwt.accessTokenExpire,
		}
	)

	const refreshToken = await reply.refreshJwtSign({ username })

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

	const { username } = request.refreshToken

	const user = await getUserByUsername(username)
	if (!user) {
		throw {
			message: `User does not exist`,
			error: 'Auth',
			statusCode: 401,
		}
	}

	const accessToken = await reply.accessJwtSign({
		user: {
			id: user.id,
			name: user.name,
			username: user.username,
			roles: user.roles,
		},
	})

	return { accessToken }
}
