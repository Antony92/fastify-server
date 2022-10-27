import { FastifyInstance } from 'fastify'
import { checkHealthHandler } from '../controllers/health.controller'

const healthRoute = async (server: FastifyInstance) => {
    server.get('/health', checkHealthHandler)
}

export default healthRoute
