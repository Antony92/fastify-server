import { SocketStream } from '@fastify/websocket'
import { FastifyRequest } from 'fastify'

export const websocketHandler = async (connection: SocketStream, request: FastifyRequest) => {

    // set up socket listeners first
    connection.socket.on('message', message => {
        console.log(`Message from client ${client}: ${message.toString()}`)
    })

    connection.socket.on('close', () => {
        console.log(`Client ${client} disconnected.`)
    })

    // client logic
    const client = request.ip
	console.log(`Client ${client} connected.`)
    connection.socket.send(`Hello ${client}!`)
}
