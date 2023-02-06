import { FastifyPluginAsync } from 'fastify'
import { secured } from '../auth/auth.guard.js'
import {
	subscribeServerEventsHandler,
	createServerEventHandler,
	getServerEventsHandler,
	updateServerEventHandler,
	deleteServerEventHandler,
} from '../controllers/server-events.controller.js'
import { createServerEventSchema, deleteServerEventSchema, getServerEventsSchema, updateServerEventSchema } from '../schema/server-events.schema.js'
import { Role } from '@prisma/client'

const serverEventsRoute: FastifyPluginAsync = async (server) => {
	server.get('/server-events/subscribe', subscribeServerEventsHandler)
	server.get('/server-events', { onRequest: secured([Role.ADMIN]), schema: getServerEventsSchema }, getServerEventsHandler)
	server.post('/server-event', { onRequest: secured([Role.ADMIN]), schema: createServerEventSchema }, createServerEventHandler)
	server.patch('/server-event/:id', { onRequest: secured([Role.ADMIN]), schema: updateServerEventSchema }, updateServerEventHandler)
	server.delete('/server-event/:id', { onRequest: secured([Role.ADMIN]), schema: deleteServerEventSchema }, deleteServerEventHandler)
}

export default serverEventsRoute
