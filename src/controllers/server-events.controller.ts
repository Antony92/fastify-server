import { FastifyReply, FastifyRequest } from 'fastify'
import {
	addServerEventClient,
	removeServerEventClient,
	sendServerEventToClient,
	sendServerEventToAll,
} from '../services/server-event.service.js'
import { ServerEvent } from '../types/server-event.type.js'

export const subscribeServerEventsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	reply.raw.setHeader('Content-Type', 'text/event-stream')
	reply.raw.setHeader('Cache-Control', 'no-cache')
	reply.raw.setHeader('Connection', 'keep-alive')

	const id = request.ip
	addServerEventClient({ id, reply })

	// TODO get last server event from db
	const event: ServerEvent = { type: 'info', message: 'Server is online' }
	sendServerEventToClient(id, event)

	reply.raw.on('close', () => {
		removeServerEventClient(id)
		reply.raw.end()
	})
}

export const createServerEventHandler = (request: FastifyRequest<{ Body: ServerEvent }>, reply: FastifyReply) => {
	const { type, message } = request.body

	const event: ServerEvent = { type, message }
	//TODO save event to db

	sendServerEventToAll(event)

	return { message: 'Server event created', data: event }
}
