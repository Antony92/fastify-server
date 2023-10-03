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
import { SSEType, ServerEventCreateBody, ServerEventUpdateBody } from '../types/server-event.type.js'
import sanitizeHtml from 'sanitize-html'

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
		sendServerEventToClient(id, SSEType.GLOBAL_MESSAGE, event)
	} else {
		reply.raw.write(`retry: 10000\ndata: connected\n\n`)
	}

	reply.raw.on('close', () => {
		removeServerEventClient(id)
		reply.raw.end()
	})
}

export const getServerEventsHandler = async (request: FastifyRequest<{ Querystring: { skip: number; limit: number } }>, reply: FastifyReply) => {
	const { skip, limit } = request.query
	const { events, total } = await getServerEvents(skip, limit)
	return { data: events, total }
}

export const createServerEventHandler = async (request: FastifyRequest<{ Body: ServerEventCreateBody }>, reply: FastifyReply) => {
	request.body.message = sanitizeHtml(request.body.message, {
		allowedTags: ['a'],
		allowedAttributes: {
			a: ['href', 'target'],
		},
	})
	const event = await createServerEvent(request.body)
	sendServerEventToAllClients(SSEType.GLOBAL_MESSAGE, event)
	await auditLog(request.user, AuditLogAction.CREATE, AuditLogTarget.SERVER_EVENT, { body: request.body, event }, 'server event created')
	return { data: event, message: 'Server event created' }
}

export const updateServerEventHandler = async (
	request: FastifyRequest<{ Params: { id: string }; Body: ServerEventUpdateBody }>,
	reply: FastifyReply
) => {
	const { id } = request.params
	request.body.message = sanitizeHtml(request.body.message as string || '', {
		allowedTags: ['a'],
		allowedAttributes: {
			a: ['href', 'target'],
		},
	})
	const event = await updateServerEvent({ id, ...request.body })
	sendServerEventToAllClients(SSEType.GLOBAL_MESSAGE, { type: event.type, message: event.message })
	await auditLog(request.user, AuditLogAction.UPDATE, AuditLogTarget.SERVER_EVENT, { id, body: request.body, event }, 'server event updated')
	return { data: event, message: 'Server event updated' }
}

export const deleteServerEventHandler = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
	const { id } = request.params
	const event = await deleteServerEvent(id)
	const lastEvent = await getLastServerEvent()
	if (lastEvent) {
		sendServerEventToAllClients(SSEType.GLOBAL_MESSAGE, { type: lastEvent.type, message: lastEvent.message })
	}
	await auditLog(request.user, AuditLogAction.DELETE, AuditLogTarget.SERVER_EVENT, event, 'server event deleted')
	return { data: event, message: 'Server event deleted' }
}
