import { ServerEventType } from '../db/prisma/client.js'
import prisma from '../db/prisma.js'
import { SSEType, ServerEventClient, ServerEventCreateInput, ServerEventUpdateInput } from '../types/server-event.type.js'

const serverEventClients: ServerEventClient[] = []
const retry = 10000

export const addServerEventClient = (client: ServerEventClient) => {
	serverEventClients.push(client)
}

export const removeServerEventClient = (clientId: string) => {
	serverEventClients.splice(
		serverEventClients.findIndex((client) => client.id === clientId),
		1,
	)
}

export const sendServerEventToAllClients = (sseType: SSEType, event: { type: ServerEventType; message: string }) => {
	serverEventClients.forEach((client) => {
		client.reply.sse.send({
			event: sseType,
			data: event,
			retry,
		})
	})
}

export const sendServerEventToClient = (clientId: string, sseType: SSEType, event: { type: ServerEventType; message: string }) => {
	serverEventClients
		.filter((client) => client.id === clientId)
		.forEach((client) => {
			client.reply.sse.send({
				event: sseType,
				data: event,
				retry,
			})
		})
}

export const getServerEvents = async (skip = 0, limit = 10) => {
	const [events, total] = await prisma.$transaction([prisma.serverEvent.findMany({ skip, take: limit }), prisma.serverEvent.count()])
	return { events, total }
}

export const getLastServerEvent = async () => {
	const event = await prisma.serverEvent.findFirst({
		orderBy: { created: 'desc' },
	})
	return event
}

export const createServerEvent = async (event: ServerEventCreateInput) => {
	const createdEvent = await prisma.serverEvent.create({
		data: {
			...event,
		},
	})
	return createdEvent
}

export const updateServerEvent = async (event: ServerEventUpdateInput) => {
	const updatedEvent = await prisma.serverEvent.update({
		data: {
			...event,
		},
		where: {
			id: event.id,
		},
	})
	return updatedEvent
}

export const deleteServerEvent = async (id: string) => {
	const deletedEvent = await prisma.serverEvent.delete({
		where: {
			id,
		},
	})
	return deletedEvent
}
