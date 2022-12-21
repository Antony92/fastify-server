import { FastifyReply, FastifyRequest } from 'fastify'
import { addServerEventClient, getLastServerEvent, removeServerEventClient, sendServerEvent } from '../services/server-event.service.js'
import { ServerEvent } from '../types/server-event.type.js'

export const subscribeServerEventsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	reply.raw.setHeader('Content-Type', 'text/event-stream')
	reply.raw.setHeader('Cache-Control', 'no-cache')
	reply.raw.setHeader('Connection', 'keep-alive')

	const id = `${request.ip}/${Date.now()}`
	addServerEventClient({ id, reply })

	const retry = 5000
	const event = await getLastServerEvent()
	const message = `retry: ${retry}\ndata: ${JSON.stringify(event)}\n\n`
	reply.raw.write(message)

	reply.raw.on('close', () => {
		removeServerEventClient(id)
		reply.raw.end()
	})
}

export const createServerEventHandler = (request: FastifyRequest<{ Body: ServerEvent }>, reply: FastifyReply) => {
	const { type, message } = request.body

	const event: ServerEvent = { type, message }
	//TODO save event to db

	sendServerEvent(event)

	return { message: 'Server event created', data: event }
}
