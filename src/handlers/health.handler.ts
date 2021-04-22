import { FastifyReply, FastifyRequest } from 'fastify'

export const checkHealthHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    return { message: 'Health is fine' }
}
