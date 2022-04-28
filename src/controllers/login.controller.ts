import { FastifyRequest, FastifyReply } from 'fastify'
import { RequestAny } from '../types/request.type'
import config from '../config'
import { getUser } from '../services/user.service'

export const loginHandler = async (request: FastifyRequest<RequestAny>, reply: FastifyReply) => {
	const { email, password } = request.body
	const user = await getUser(email, password)
	if (!user) {
		reply.status(401).send({ message: 'Wrong email or password' })
		return reply
	}
	const token = await reply.jwtSign(user)
	reply
		.cookie(config.cookie.name, token, {
			httpOnly: true,
			secure: true,
			sameSite: true,
			path: '/',
			expires: new Date(Date.now() + config.cookie.expire),
		})
		.send({ token })
	return reply
}

export const logoutHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	reply.clearCookie(config.cookie.name).send({ message: 'Logout successful' })
	return reply
}
