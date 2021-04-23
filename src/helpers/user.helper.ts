import { FastifyRequest } from 'fastify'
import { User } from '../model/user.model'
import { getJWTFromRequest, getJWTPayload } from '../auth/jwt.auth'

export const hasRole = (request: FastifyRequest, roles: string[]) => {
	try {
		const jwt = getJWTFromRequest(request)
		const user = getJWTPayload(jwt) as User
		return user?.roles.some((role) => roles.includes(role))
	} catch (error) {
		// log error
		return false
	}
}