import { FastifyRequest, FastifyReply } from 'fastify'
import config from '../config'
import crypto from 'crypto'
import { LoginRequest } from '../types/request.type'
import { getUser } from '../services/user.service'

export const loginHandler = async (request: FastifyRequest<LoginRequest>, reply: FastifyReply) => {
	const { email, password } = request.body
	const user = await getUser(email)

	if (!user)
		throw {
			message: `Wrong username or password`,
			error: 'Login',
			statusCode: 400,
		}

	const accessToken = await reply.jwtSign(
		{
			jti: crypto.randomUUID(),
			iss: config.jwt.issuer,
			...user,
		},
		{ expiresIn: config.jwt.accessTokenExpire }
	)

	const refreshToken = await reply.jwtSign(
		{
			jti: crypto.randomUUID(),
			email: user.email,
		},
		{ expiresIn: config.jwt.refreshTokenExpire }
	)

	reply.cookie(config.cookie.name, refreshToken, {
		httpOnly: true,
		secure: config.environment === 'production',
		sameSite: 'none',
		path: '/',
		expires: new Date(Date.now() + config.cookie.expire),
	})

	return { accessToken }
}

export const logoutHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	reply.clearCookie(config.cookie.name)
	return { message: 'Logout successful' }
}

export const refreshHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	await request.jwtVerify({ onlyCookie: true } as unknown)

	const refreshToken = request.server.jwt.decode(request.cookies.jwt) as any
	const user = await getUser(refreshToken.email)

	if (!user)
		throw {
			message: `User does not exist`,
			error: 'Login',
			statusCode: 400,
		}

	const accessToken = await reply.jwtSign(
		{
			jti: crypto.randomUUID(),
			...user,
		},
		{ expiresIn: config.jwt.accessTokenExpire }
	)

	return { accessToken }
}

