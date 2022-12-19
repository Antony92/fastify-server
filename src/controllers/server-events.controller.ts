import { FastifyReply, FastifyRequest } from 'fastify'
import { getServerEventsObservable, sendServerEvent } from '../services/server-event.service.js'
import { ServerEvent } from '../types/server-event.type.js'

export const subscribeServerEventsHandler = (request: FastifyRequest, reply: FastifyReply) => {
	reply.raw.setHeader('Content-Type', 'text/event-stream')
	reply.raw.setHeader('Cache-Control', 'no-cache')
	reply.raw.setHeader('Connection', 'keep-alive')
	const retry = 5000
	const sub = getServerEventsObservable().subscribe((event) => {
		const message = `retry: ${retry}\ndata: ${JSON.stringify(event)}\n\n`
		reply.raw.write(message)
	})
	reply.raw.on('close', () => {
		sub.unsubscribe()
		reply.raw.end()
	})
}

export const createServerEventHandler = (request: FastifyRequest<{ Body: ServerEvent }>, reply: FastifyReply) => {
	const { type, message } = request.body

	const event = { type, message }
	//TODO save event to db

	sendServerEvent(event)

	return { message: 'Server event created', data: event }
}
