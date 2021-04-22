import { onRequestAsyncHookHandler } from 'fastify'
import { getJWTFromRequest, hasRole, isJWTValid } from './jwt.auth'

export const secured = (roles?: string[], allowRoles = true): onRequestAsyncHookHandler => {
    return async (request, reply) => {
        const jwt = getJWTFromRequest(request)
        const valid = await isJWTValid(jwt)
        const inRole = valid && roles?.length > 0 && allowRoles ? hasRole(request, roles) : !hasRole(request, roles)
        if (!valid) {
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
