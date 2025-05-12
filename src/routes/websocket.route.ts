import type { FastifyPluginAsync } from 'fastify'
import { websocketHandler } from '../controllers/websocket.controller.js'

const websocketRoute: FastifyPluginAsync = async (server) => {
	server.get('/websocket', { websocket: true, schema: { hide: true } }, websocketHandler)
}

export default websocketRoute
