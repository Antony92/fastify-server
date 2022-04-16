import { FastifyRequest, FastifyReply } from 'fastify'
import crypto from 'crypto'
import { RequestAny } from '../types/request.type'
import config from '../config'
import { User } from '../models/user.model'

const cookieName = 'jwt'

export const loginHandler = async (request: FastifyRequest<RequestAny>, reply: FastifyReply) => {
	const { email, password } = request.body
	// check against db
    const user: User = {
        email,
        name: 'user',
        roles: ['admin'],
        jti: crypto.randomBytes(30).toString('hex')
    }
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
