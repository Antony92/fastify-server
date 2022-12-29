import { Prisma } from '@prisma/client'
import { FastifyReply } from 'fastify'

export type ServerEventBody = Omit<Prisma.ServerEventCreateInput, 'id' | 'created' | 'updated'>

export type ServerEventClient = {
	id: string
	reply: FastifyReply
}
