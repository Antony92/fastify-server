import { FastifyReply } from 'fastify'

export type ServerEvent = {
	id?: string,
	type: 'info' | 'warning' | 'danger'
	message: string,
}

export type ServerEventBody = {
	type: 'info' | 'warning' | 'danger'
	message: string,
}

export type ServerEventClient = {
	id: string
	reply: FastifyReply
}
