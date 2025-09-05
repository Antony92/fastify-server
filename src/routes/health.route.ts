import { FastifyPluginAsync } from 'fastify'
import { checkHealthHandler } from '../controllers/health.controller.js'

const healthRoute: FastifyPluginAsync = async (server) => {
	server.get('/health', checkHealthHandler)
}

export default healthRoute
