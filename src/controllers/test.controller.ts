import { FastifyRequest, FastifyReply } from 'fastify'
import crypto from 'crypto'
import { RequestAny } from '../types/request.type'

export const testGetHandler = async (request: FastifyRequest<RequestAny>, reply: FastifyReply) => {
	return { message: `Get ${request.params.id} works` }
}

export const testPostHandler = async (request: FastifyRequest<RequestAny>, reply: FastifyReply) => {
	return { message: 'Post works' }
}

export const testSecuredHandler = async (request: FastifyRequest<RequestAny>, reply: FastifyReply) => {
	return { message: 'Secured' }
}

export const testLoginHandler = async (request: FastifyRequest<RequestAny>, reply: FastifyReply) => {
	const token = await reply.jwtSign({ jti: crypto.randomBytes(30).toString('hex') ,name: 'user', email: 'user@email.com', roles: ['admin'] })
	return { token }
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
