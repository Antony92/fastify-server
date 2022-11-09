import { FastifyInstance } from 'fastify'
import { secured } from '../auth/auth.guard'
import { subscribeServerEventsHandler, createServerEventHandler } from '../controllers/server-events.controller'
import { Roles } from '../models/user.model'
import { createServerEventSchema } from '../schema/server-events.schema'

const serverEventsRoute = async (server: FastifyInstance) => {
    server.get('/server-events/subscribe', subscribeServerEventsHandler)
    server.post('/server-events', { onRequest: secured([Roles.ADMIN]), schema: createServerEventSchema }, createServerEventHandler)
}

export default serverEventsRoute
