import { FastifyPluginAsync } from 'fastify'

const healthRoute: FastifyPluginAsync = async (fastify, options) => {
    fastify.get('/health', async (request, reply) => ({ message: 'Online' }))
}

export default healthRoute
