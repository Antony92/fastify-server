import { FastifyReply, FastifyRequest } from 'fastify'
import { auditLog } from '../services/audit-log.service.js'
import {
	addServerEventClient,
	removeServerEventClient,
	sendServerEventToClient,
	sendServerEventToAll,
	getLastServerEvent,
	getServerEvents,
	createServerEvent,
	updateServerEvent,
	deleteServerEvent,
} from '../services/server-event.service.js'
import { AuditLogAction, AuditLogTarget } from '../types/audit-log.type.js'
import { ServerEventCreateBody, ServerEventUpdateBody } from '../types/server-event.type.js'

export const subscribeServerEventsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	reply.raw.setHeader('Content-Type', 'text/event-stream')
	reply.raw.setHeader('Cache-Control', 'no-cache')
	reply.raw.setHeader('Connection', 'keep-alive')

	const id = request.ip
	addServerEventClient({ id, reply })

	const event = await getLastServerEvent()
	if (event) {
		sendServerEventToClient(id, event)
	}

	reply.raw.on('close', () => {
		removeServerEventClient(id)
		reply.raw.end()
	})
}

export const getServerEventsHandler = async (request: FastifyRequest<{ Querystring: { skip: number; limit: number } }>, reply: FastifyReply) => {
	const { skip, limit } = request.query

	const events = await getServerEvents(skip, limit)
	return events
}

export const createServerEventHandler = async (request: FastifyRequest<{ Body: ServerEventCreateBody }>, reply: FastifyReply) => {
	const event = await createServerEvent(request.body)
	sendServerEventToAll(event)

	await auditLog(request.user, AuditLogAction.CREATE, AuditLogTarget.SERVER_EVENT, event)

	return { message: 'Server event created', data: event }
}

export const updateServerEventHandler = async (
	request: FastifyRequest<{ Params: { id: string }; Body: ServerEventUpdateBody }>,
	reply: FastifyReply
) => {
	const { id } = request.params
	
	const event = await updateServerEvent({ id, ...request.body })
	sendServerEventToAll({ type: event.type, message: event.message })

	await auditLog(request.user, AuditLogAction.UPDATE, AuditLogTarget.SERVER_EVENT, event)

	return { message: 'Server event updated', data: event }
}

export const deleteServerEventHandler = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
	const { id } = request.params

	const event = await deleteServerEvent(id)
	const lastEvent = await getLastServerEvent()
	if (lastEvent) {
		sendServerEventToAll({ type: lastEvent.type, message: lastEvent.message })
	}

	await auditLog(request.user, AuditLogAction.DELETE, AuditLogTarget.SERVER_EVENT, event)
	
	return { message: 'Server event deleted', data: event }
}
