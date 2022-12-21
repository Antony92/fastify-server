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