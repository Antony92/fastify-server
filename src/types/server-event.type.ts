import { Prisma } from '@prisma/client'
import { FastifyReply } from 'fastify'

export type ServerEventCreateBody = Pick<Prisma.ServerEventCreateInput, 'type' | 'message'>

export type ServerEventUpdateBody = Pick<Prisma.ServerEventUpdateInput, 'type' | 'message'>

export type ServerEventCreateInput = Pick<Prisma.ServerEventCreateInput, 'type' | 'message'>

export type ServerEventUpdateInput = { id: string } & Pick<Prisma.ServerEventUpdateInput, 'type' | 'message'>

export type ServerEventClient = {
	id: string
	reply: FastifyReply
}

export enum SSEType {
	GLOBAL_MESSAGE = 'globalmessage'
}