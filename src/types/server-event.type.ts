import { FastifyReply } from 'fastify'

export type ServerEvent = {
	id: string,
	type: 'info' | 'warning' | 'danger'
	message: string
}

export type ServerEventCreateBody = Omit<ServerEvent, 'id'>

export type ServerEventUpdateBody = Partial<ServerEvent>

export type ServerEventClient = {
	id: string
	reply: FastifyReply
}
