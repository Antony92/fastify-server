import { FastifyReply, FastifyRequest } from 'fastify'
import { ServerEvent } from '../models/server-event.model'
import { getServerEventsObservable, sendServerEvent } from '../services/server-event.service'
import { CreateServerEventRequest } from '../types/request.type'

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

export const createServerEventHandler = (request: FastifyRequest<CreateServerEventRequest>, reply: FastifyReply) => {
	const { type, message } = request.body

	const event = { type, message } as ServerEvent
	//TODO save event to db

	sendServerEvent(event)

	return { message: 'Server event created', data: event }
}
