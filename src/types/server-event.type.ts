import { Prisma } from '../db/prisma/client.js'
import { FastifyReply } from 'fastify'

export type ServerEventCreateBody = Pick<Prisma.ServerEventCreateInput, 'type' | 'message'>

export type ServerEventUpdateBody = Pick<Prisma.ServerEventUpdateInput, 'type' | 'message'>

export type ServerEventCreateInput = Pick<Prisma.ServerEventCreateInput, 'type' | 'message'>

export type ServerEventUpdateInput = { id: string } & Pick<Prisma.ServerEventUpdateInput, 'type' | 'message'>

export type ServerEventClient = {
	id: string
	reply: FastifyReply
}

export const SSE = {
	GLOBAL_MESSAGE: 'globalmessage',
} as const

export type SSEType = (typeof SSE)[keyof typeof SSE]
