import  { FastifyRequest } from 'fastify'
import { WebSocket } from 'ws'

export const websocketHandler = async (socket: WebSocket, request: FastifyRequest) => {

    // set up socket listeners first
    socket.on('message', message => {
        console.log(`Message from client ${client}: ${message.toString()}`)
    })

    socket.on('close', () => {
        console.log(`Client ${client} disconnected.`)
    })

    // client logic
    const client = request.ip
	console.log(`Client ${client} connected.`)
    socket.send(`Hello ${client}!`)
}
