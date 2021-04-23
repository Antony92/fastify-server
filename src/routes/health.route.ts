import { FastifyInstance } from 'fastify'
import { checkHealthHandler } from '../controllers/health.controller'

const healthRoute = async (fastify: FastifyInstance) => {
    fastify.get('/health', checkHealthHandler)
}

export default healthRoute
