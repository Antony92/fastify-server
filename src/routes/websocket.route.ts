import { FastifyInstance } from 'fastify'
import { websocketHandler } from '../controllers/websocket.controller.js'

const websocketRoute = async (server: FastifyInstance) => {
	server.get('/websocket', { websocket: true }, websocketHandler)
}

export default websocketRoute
