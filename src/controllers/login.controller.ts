import { FastifyRequest, FastifyReply } from 'fastify'
import config from '../config'
import crypto from 'crypto'

export const loginHandler = async (request: FastifyRequest, reply: FastifyReply) => {
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
	return { token }
}

export const logoutHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	reply.clearCookie(config.cookie.name)
	return { message: 'Logout successful' }
}
