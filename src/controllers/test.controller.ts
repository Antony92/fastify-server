import { FastifyRequest, FastifyReply } from 'fastify'

export const testGetHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	return { message: `Get test works` }
}

export const testGetByIdHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	const { id } = request.params as any
	return { message: `Get test by id works`, id }
}

export const testPostHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	const { number, name } = request.body as any
	return { number, name }
}

export const testUploadHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	const data = await request.saveRequestFiles({
		limits: {
			files: 1,
			fileSize: 1 * 1024 * 1024 // 1MB
		}
	})
	return { message: `Upload file works` }
}

export const testSecuredHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	return { message: `Secured by logged user`, user: request.user }
}

export const testAdminHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	return { message: `Secured by role admin`, user: request.user }
}

export const testEventHandler = (request: FastifyRequest, reply: FastifyReply) => {
	reply.raw.setHeader('Content-Type', 'text/event-stream')
	reply.raw.setHeader('Cache-Control', 'no-cache')
	reply.raw.setHeader('Connection', 'keep-alive')
	const timeout = 5000
	const interval = setInterval(() => {
		const id = Date.now()
		const data = `Hello World ${id}`
		const message = `retry: ${timeout}\nid:${id}\ndata: ${data}\n\n`
		reply.raw.write(message)
	}, timeout)
	reply.raw.on('close', () => {
		console.log('close')
		clearInterval(interval)
		reply.raw.end()
	})
}
