import { FastifyReply, FastifyRequest } from 'fastify'

export const notFoundHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	if (request.url.includes('/api')) {
		reply.status(404).send({
			message: `Route ${request.method}:${request.url} not found`,
			error: 'Not Found',
			statusCode: 404,
		})
	} else {
		reply.sendFile('index.html')
	}
	return reply
}
