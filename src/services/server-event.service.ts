import { ServerEvent, ServerEventClient } from '../types/server-event.type.js'

const serverEventClients: ServerEventClient[] = []

export const addServerEventClient = (client: ServerEventClient) => {
	serverEventClients.push(client)
}

export const removeServerEventClient = (id: string) => {
	serverEventClients.splice(serverEventClients.findIndex(client => client.id === id), 1)
}

export const getLastServerEvent = async () => {
	const event: ServerEvent = { type: 'info', message: 'Server is online' }
	return event
}

export const sendServerEvent = (event: ServerEvent, retry = 5000) => {
	serverEventClients.forEach(client => {
		const message = `retry: ${retry}\ndata: ${JSON.stringify(event)}\n\n`
		client.reply.raw.write(message)
	})
}
