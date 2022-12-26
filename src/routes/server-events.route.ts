import { FastifyInstance } from 'fastify'
import { secured } from '../auth/auth.guard.js'
import {
	subscribeServerEventsHandler,
	createServerEventHandler,
	getServerEventsHandler,
	updateServerEventHandler,
	deleteServerEventHandler,
} from '../controllers/server-events.controller.js'
import { createServerEventSchema, deleteServerEventSchema, getServerEventsSchema, updateServerEventSchema } from '../schema/server-events.schema.js'
import { Roles } from '../types/user.type.js'

const serverEventsRoute = async (server: FastifyInstance) => {
	server.get('/server-events/subscribe', subscribeServerEventsHandler)
	server.get('/server-events', { onRequest: secured([Roles.ADMIN]), schema: getServerEventsSchema }, getServerEventsHandler)
	server.post('/server-events', { onRequest: secured([Roles.ADMIN]), schema: createServerEventSchema }, createServerEventHandler)
	server.patch('/server-events/:id', { onRequest: secured([Roles.ADMIN]), schema: updateServerEventSchema }, updateServerEventHandler)
	server.delete('/server-events/:id', { onRequest: secured([Roles.ADMIN]), schema: deleteServerEventSchema }, deleteServerEventHandler)
}

export default serverEventsRoute
