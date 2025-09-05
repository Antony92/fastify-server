import { FastifyReply, FastifyRequest } from 'fastify'
import { auditLog } from '../services/audit-log.service.js'
import {
	addServerEventClient,
	removeServerEventClient,
	sendServerEventToClient,
	sendServerEventToAllClients,
	getLastServerEvent,
	getServerEvents,
	createServerEvent,
	updateServerEvent,
	deleteServerEvent,
} from '../services/server-event.service.js'
import { AuditLogAction, AuditLogTarget } from '../types/audit-log.type.js'
import { SSE, ServerEventCreateBody, ServerEventUpdateBody } from '../types/server-event.type.js'
import sanitizeHtml from 'sanitize-html'
import { IdParam, PaginationQuery } from '../types/request.type.js'

export const subscribeServerEventsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	reply.raw.setHeader('Content-Type', 'text/event-stream')
	reply.raw.setHeader('Cache-Control', 'no-cache')
	reply.raw.setHeader('Connection', 'keep-alive')
	reply.raw.setHeader('Access-Control-Allow-Origin', '*')
	reply.raw.setHeader('X-Accel-Buffering', 'no')

	const id = request.ip
	addServerEventClient({ id, reply })

	const event = await getLastServerEvent()
	if (event) {
		sendServerEventToClient(id, SSE.GLOBAL_MESSAGE, event)
	} else {
		reply.raw.write(`retry: 10000\ndata: connected\n\n`)
	}

	reply.raw.on('close', () => {
		removeServerEventClient(id)
		reply.raw.end()
	})
}

export const getServerEventsHandler = async (request: FastifyRequest<{ Querystring: PaginationQuery }>) => {
	const { skip, limit } = request.query
	const { events, total } = await getServerEvents(skip, limit)
	return { data: events, total }
}

export const createServerEventHandler = async (request: FastifyRequest<{ Body: ServerEventCreateBody }>) => {
	const body = request.body
	body.message = sanitizeHtml(body.message, {
		allowedTags: ['a'],
		allowedAttributes: {
			a: ['href', 'target'],
		},
	})
	const event = await createServerEvent(body)
	sendServerEventToAllClients(SSE.GLOBAL_MESSAGE, event)
	await auditLog(request.user, AuditLogAction.CREATE, AuditLogTarget.SERVER_EVENT, { body, event }, 'server event created')
	return { data: event, message: 'Server event created' }
}

export const updateServerEventHandler = async (request: FastifyRequest<{ Params: IdParam; Body: ServerEventUpdateBody }>) => {
	const { id } = request.params
	const body = request.body
	body.message = sanitizeHtml(body.message as string, {
		allowedTags: ['a'],
		allowedAttributes: {
			a: ['href', 'target'],
		},
	})
	const event = await updateServerEvent({ id, ...body })
	sendServerEventToAllClients(SSE.GLOBAL_MESSAGE, { type: event.type, message: event.message })
	await auditLog(request.user, AuditLogAction.UPDATE, AuditLogTarget.SERVER_EVENT, { id, body, event }, 'server event updated')
	return { data: event, message: 'Server event updated' }
}

export const deleteServerEventHandler = async (request: FastifyRequest<{ Params: IdParam }>) => {
	const { id } = request.params
	const event = await deleteServerEvent(id)
	const lastEvent = await getLastServerEvent()
	if (lastEvent) {
		sendServerEventToAllClients(SSE.GLOBAL_MESSAGE, { type: lastEvent.type, message: lastEvent.message })
	}
	await auditLog(request.user, AuditLogAction.DELETE, AuditLogTarget.SERVER_EVENT, event, 'server event deleted')
	return { data: event, message: 'Server event deleted' }
}
