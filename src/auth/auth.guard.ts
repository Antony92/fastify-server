import { FastifyRequest, FastifyReply } from 'fastify'
import { hasRole } from '../helpers/user.helper'
import { getJWTFromRequest, isJWTValid } from './jwt.auth'

export const secured = (roles?: string[]) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const jwt = getJWTFromRequest(request)
        const jwtValid = await isJWTValid(jwt)
        const inRole = jwtValid && hasRole(request, roles)
        if (!jwtValid) {
            reply.status(401).send({
                message: `Token not valid`,
                error: 'Token error',
                statusCode: 401,
            })
            return reply
        }
        if (!inRole) {
            reply.status(403).send({
                message: `Access denied`,
                error: 'Access error',
                statusCode: 403,
            })
            return reply
        }
    }
}
