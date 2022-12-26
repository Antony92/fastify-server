import { FastifyReply, FastifyRequest } from 'fastify'
import { audit } from '../services/audit.service.js'
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
import { AuditAction, AuditTarget } from '../types/audit.type.js'
import { ServerEvent } from '../types/server-event.type.js'

export const subscribeServerEventsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	reply.raw.setHeader('Content-Type', 'text/event-stream')
	reply.raw.setHeader('Cache-Control', 'no-cache')
	reply.raw.setHeader('Connection', 'keep-alive')

	const id = request.ip
	addServerEventClient({ id, reply })

	const event = await getLastServerEvent()
	sendServerEventToClient(id, event)

	reply.raw.on('close', () => {
		removeServerEventClient(id)
		reply.raw.end()
	})
}

export const getServerEventsHandler = async (request: FastifyRequest<{ Querystring: { offset: number; limit: number } }>, reply: FastifyReply) => {
	const { offset, limit } = request.query

	const events = await getServerEvents(offset, limit)
	return { data: events }
}

export const createServerEventHandler = async (request: FastifyRequest<{ Body: ServerEvent }>, reply: FastifyReply) => {
	const { type, message } = request.body

	const event = await createServerEvent({ type, message })

	await audit(request.user, AuditAction.CREATE, AuditTarget.SERVER_EVENT, event)

	sendServerEventToAll(event)

	return { message: 'Server event created', data: event }
}

export const updateServerEventHandler = async (request: FastifyRequest<{ Params: { id: string }; Body: ServerEvent }>, reply: FastifyReply) => {
	const { id } = request.params
	const { type, message } = request.body

	const event = await updateServerEvent({ id, type, message })

	await audit(request.user, AuditAction.UPDATE, AuditTarget.SERVER_EVENT, event)

	sendServerEventToAll(event)

	return { message: 'Server event updated', data: event }
}

export const deleteServerEventHandler = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
	const { id } = request.params

	const event = await deleteServerEvent(id)

	await audit(request.user, AuditAction.DELETE, AuditTarget.SERVER_EVENT, event)

	const lastEvent = await getLastServerEvent()

	if (lastEvent) {
		sendServerEventToAll(lastEvent)
	}

	return { message: 'Server event deleted' }
}
