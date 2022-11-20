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
			error: 'Auth',
			statusCode: 401,
		}

	const accessToken = await reply.accessJwtSign(
		{ user },
		{
			jti: crypto.randomUUID(),
			expiresIn: config.jwt.accessTokenExpire,
		}
	)

	const refreshToken = await reply.refreshJwtSign(
		{ email },
		{
			jti: crypto.randomUUID(),
			expiresIn: config.jwt.refreshTokenExpire,
		}
	)

	reply.cookie(config.cookies.accessName, accessToken, {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		path: '/api',
		expires: new Date(Date.now() + config.cookies.accessExpire),
	})

	reply.cookie(config.cookies.refreshName, refreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		path: '/api/v1/auth/refresh',
		expires: new Date(Date.now() + config.cookies.refreshExpire),
	})

	return { accessToken }
}

export const logoutHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	reply.clearCookie(config.cookies.accessName, { path: '/api' })
	reply.clearCookie(config.cookies.refreshName, { path: '/api/v1/auth/refresh' })
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
			expiresIn: config.jwt.accessTokenExpire
		}
	)

	reply.cookie(config.cookies.accessName, accessToken, {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		path: '/api',
		expires: new Date(Date.now() + config.cookies.accessExpire),
	})

	return { accessToken }
}
