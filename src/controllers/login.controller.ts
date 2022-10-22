import { FastifyRequest, FastifyReply } from 'fastify'
import { LoginRequest } from '../types/request.type'
import config from '../config'
import { getUser } from '../services/user.service'
import crypto from 'crypto'

export const loginHandler = async (request: FastifyRequest<LoginRequest>, reply: FastifyReply) => {
	const { email, password } = request.body
	const user = await getUser(email, password)
	if (!user) {
		throw { status: 403, message: 'Wrong email or password', for: 'Login' }
	}
	const token = await reply.jwtSign({
		jti: crypto.randomBytes(30).toString('hex'),
		...user
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
