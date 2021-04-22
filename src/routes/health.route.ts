import { FastifyInstance } from 'fastify'
import { checkHealthHandler } from '../handlers/health.handler'

const healthRoute = async (fastify: FastifyInstance) => {
    fastify.get('/health', checkHealthHandler)
}

export default healthRoute
