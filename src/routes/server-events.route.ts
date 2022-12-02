import { FastifyInstance } from 'fastify'
import { secured } from '../auth/auth.guard.js'
import { subscribeServerEventsHandler, createServerEventHandler } from '../controllers/server-events.controller.js'
import { Roles } from '../models/user.model.js'
import { createServerEventSchema } from '../schema/server-events.schema.js'

const serverEventsRoute = async (server: FastifyInstance) => {
    server.get('/server-events/subscribe', subscribeServerEventsHandler)
    server.post('/server-events', { onRequest: secured([Roles.ADMIN]), schema: createServerEventSchema }, createServerEventHandler)
}

export default serverEventsRoute
