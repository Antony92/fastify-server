import { FastifyPluginAsync } from 'fastify'
import { secured } from '../auth/auth.guard.js'
import {
	subscribeServerEventsHandler,
	createServerEventHandler,
	getServerEventsHandler,
	updateServerEventHandler,
	deleteServerEventHandler,
} from '../controllers/server-event.controller.js'
import { createServerEventSchema, deleteServerEventSchema, getServerEventsSchema, updateServerEventSchema } from '../schema/server-event.schema.js'
import { Role } from '../types/user.type.js'
import { IdParam, PaginationQuery } from '../types/request.type.js'
import { ServerEventCreateBody, ServerEventUpdateBody } from '../types/server-event.type.js'

const serverEventsRoute: FastifyPluginAsync = async (server) => {
	server.get('/sse', { sse: true, schema: { hide: true } }, subscribeServerEventsHandler)
	server.get<{ Querystring: PaginationQuery }>(
		'/server-events',
		{ onRequest: secured([Role.ADMIN]), schema: getServerEventsSchema },
		getServerEventsHandler,
	)
	server.post<{ Body: ServerEventCreateBody }>(
		'/server-event',
		{ onRequest: secured([Role.ADMIN]), schema: createServerEventSchema },
		createServerEventHandler,
	)
	server.patch<{ Params: IdParam; Body: ServerEventUpdateBody }>(
		'/server-event/:id',
		{ onRequest: secured([Role.ADMIN]), schema: updateServerEventSchema },
		updateServerEventHandler,
	)
	server.delete<{ Params: IdParam }>(
		'/server-event/:id',
		{ onRequest: secured([Role.ADMIN]), schema: deleteServerEventSchema },
		deleteServerEventHandler,
	)
}

export default serverEventsRoute
