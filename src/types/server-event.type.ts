import { FastifyReply } from 'fastify'

export type ServerEvent = {
	id: string,
	type: 'info' | 'warning' | 'danger'
	message: string
}

export type ServerEventCreate = Omit<ServerEvent, 'id'>

export type ServerEventUpdate = Partial<ServerEventCreate>

export type ServerEventClient = {
	id: string
	reply: FastifyReply
}
