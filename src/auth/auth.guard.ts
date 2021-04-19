import { onRequestAsyncHookHandler } from 'fastify';

export const secured = (roles?: string[], allowRoles = true): onRequestAsyncHookHandler => {
    return async (request, reply) => {
        console.log('secured', roles, allowRoles)
    }
}