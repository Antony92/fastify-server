import { Prisma } from '@prisma/client'
import { FastifyReply } from 'fastify'

export type ServerEventCreateBody = Omit<Prisma.ServerEventCreateInput, 'id' | 'created' | 'updated'>

export type ServerEventUpdateBody = Omit<Prisma.ServerEventUpdateInput, 'id' | 'created' | 'updated'>

export type ServerEventCreateInput = Omit<Prisma.ServerEventCreateInput, 'id' | 'created' | 'updated'>

export type ServerEventUpdateInput = { id: string } & Omit<Prisma.ServerEventUpdateInput, 'id' | 'created' | 'updated'>

export type ServerEventClient = {
	id: string
	reply: FastifyReply
}