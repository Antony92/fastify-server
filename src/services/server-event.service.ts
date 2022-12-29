import { ServerEvent } from '@prisma/client'
import prisma from '../db/prisma.js'
import { ServerEventClient, ServerEventCreate, ServerEventUpdate } from '../types/server-event.type.js'

const serverEventClients: ServerEventClient[] = []
const retry = 5000

export const addServerEventClient = (client: ServerEventClient) => {
	serverEventClients.push(client)
}

export const removeServerEventClient = (id: string) => {
	serverEventClients.splice(
		serverEventClients.findIndex((client) => client.id === id),
		1
	)
}

export const sendServerEventToAll = (event: ServerEvent) => {
	serverEventClients.forEach((client) => {
		client.reply.raw.write(`retry: ${retry}\ndata: ${JSON.stringify(event)}\n\n`)
	})
}

export const sendServerEventToClient = (id: string, event: ServerEvent) => {
	serverEventClients
		.filter((client) => client.id === id)
		.forEach((client) => {
			client.reply.raw.write(`retry: ${retry}\ndata: ${JSON.stringify(event)}\n\n`)
		})
}

export const getServerEvents = async (skip = 0, limit = 10) => {
	const [events, total] = await prisma.$transaction([
		prisma.serverEvent.findMany({ skip, take: limit }),
		prisma.serverEvent.count()
	])
	return { data: events, total }
}

export const getLastServerEvent = async () => {
	const event = await prisma.serverEvent.findFirst({
		orderBy: { created: 'desc' },
	})
	return event
}

export const createServerEvent = async (event: ServerEventCreate) => {
	const createdEvent = await prisma.serverEvent.create({
		data: {
			type: event.type,
			message: event.message,
		},
	})
	return createdEvent
}

export const updateServerEvent = async (id: string, event: ServerEventUpdate) => {
	const updatedEvent = await prisma.serverEvent.update({
		data: {
			type: event.type,
			message: event.message,
			updated: new Date()
		},
		where: {
			id,
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
