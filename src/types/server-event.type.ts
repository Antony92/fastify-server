import { FastifyReply } from 'fastify'

export type ServerEventCreateBody = {
	type: 'info' | 'warning' | 'danger'
	message: string
}

export type ServerEventUpdateBody = {
	id?: string
	type?: 'info' | 'warning' | 'danger'
	message?: string
}

export type ServerEventClient = {
	id: string
	reply: FastifyReply
}
