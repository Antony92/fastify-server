import { FastifyRequest, FastifyReply } from 'fastify'

export const testGetHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	reply.send({ message: `Get test works` })
	return reply
}

export const testGetByIdHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	const { id } = request.params as any
	reply.send({ message: `Get test by id works`, id })
	return reply
}

export const testPostHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	const { number, name } = request.body as any
	const test = {
		number,
		name
	}
	reply.send({ message: `Post test works`, test })
	return reply
}

export const testUploadHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	const data = await request.saveRequestFiles({
		limits: {
			files: 1,
			fileSize: 1 * 1024 * 1024 // 1MB
		}
	})
	reply.send({ message: `Upload file works` })
	return reply
}

export const testSecuredHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	reply.send({ message: `Secured by logged user`, user: request.user })
	return reply
}

export const testAdminHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	reply.send({ message: `Secured by role admin`, user: request.user })
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
