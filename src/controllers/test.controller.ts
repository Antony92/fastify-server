import { FastifyRequest, FastifyReply } from 'fastify'
import { RequestAny } from '../types/request.type'

export const testGetHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	reply.send({ message: `Get test works` })
	return reply
}

export const testGetByIdHandler = async (request: FastifyRequest<RequestAny>, reply: FastifyReply) => {
	reply.send({ message: `Get test ${request.params.id} works` })
	return reply
}

export const testPostHandler = async (request: FastifyRequest<RequestAny>, reply: FastifyReply) => {
	const { number, name } = request.body
	const test = {
		number,
		name
	}
	reply.send({ message: `Post test ${JSON.stringify(test)} works` })
	return reply
}

export const testSecuredHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	reply.send({ message: 'Secured by logged user' })
	return reply
}

export const testAdminHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	reply.send({ message: 'Secured by role admin' })
	return reply
}

export const testEventHandler = (request: FastifyRequest, reply: FastifyReply) => {
	reply.raw.setHeader('Content-Type', 'text/event-stream')
	reply.raw.setHeader('Cache-Control', 'no-cache')
	reply.raw.setHeader('Connection', 'keep-alive')
	const timeout = 500
	const interval = setInterval(() => {
		const id = Date.now()
		const data = `Hello World ${id}`
		const message = `retry: ${timeout}\nid:${id}\ndata: ${data}\n\n`
		reply.raw.write(message)
	}, timeout)
	reply.raw.on('close', () => {
		clearInterval(interval)
		reply.raw.end()
	})
}
