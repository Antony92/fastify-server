import { FastifyRequest, FastifyReply } from 'fastify'
import { RequestAny } from '../types/request.type'
import config from '../config'
import { getUser } from '../services/user.service'

const cookieName = 'jwt'

export const loginHandler = async (request: FastifyRequest<RequestAny>, reply: FastifyReply) => {
	const { email, password } = request.body
    const user = await getUser(email, password)
	const token = await reply.jwtSign(user)
	reply
		.cookie(cookieName, token, {
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
	reply.clearCookie(cookieName).send({ message: 'Logout successful' })
	return reply
}
