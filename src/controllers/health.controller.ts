import { FastifyReply, FastifyRequest } from 'fastify'

export const checkHealthHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send({ message: 'Health is fine' })
    return reply
}
