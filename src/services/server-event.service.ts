import { ServerEvent, ServerEventClient } from '../types/server-event.type.js'

const serverEventClients: ServerEventClient[] = []
const retry = 5000

export const addServerEventClient = (client: ServerEventClient) => {
	serverEventClients.push(client)
}

export const removeServerEventClient = (id: string) => {
	serverEventClients.splice(serverEventClients.findIndex(client => client.id === id), 1)
}

export const sendServerEventToAll = (event: ServerEvent) => {
	serverEventClients.forEach(client => {
		client.reply.raw.write(`retry: ${retry}\ndata: ${JSON.stringify(event)}\n\n`)
	})
}

export const sendServerEventToClient = (id: string, event: ServerEvent) => {
	serverEventClients
	.filter(client => client.id === id)
	.forEach(client => {
		client.reply.raw.write(`retry: ${retry}\ndata: ${JSON.stringify(event)}\n\n`)
	})
}

export const getServerEvents = async (offset = 0, limit = 10) => {
	//TODO get server events from db
	return [] as ServerEvent[]
}

export const getLastServerEvent = async () => {
	//TODO get last server event from db
	return { type: 'info', message: 'Server is online'} as ServerEvent
}

export const createServerEvent = async (event: ServerEvent) => {
	//TODO save server event in db
	return event
}

export const updateServerEvent = async (event: ServerEvent) => {
	//TODO update server event in db
	return event
}

export const deleteServerEvent = async (id: string) => {
	//TODO delete server event in db
	return { type: 'info', message: 'Server is online'} as ServerEvent
}