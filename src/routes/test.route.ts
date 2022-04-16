import { FastifyInstance } from 'fastify'
import { testGetHandler, testPostHandler, testSecuredHandler, testEventHandler, testGetByIdHandler } from '../controllers/test.controller'
import { secured } from '../auth/auth.guard'
import { testPostSchema } from '../schema/test.schema'

const testRoute = async (fastify: FastifyInstance) => {
    fastify.get('/test', testGetHandler)
    fastify.get('/test/:id', testGetByIdHandler)
    fastify.post('/test', { schema: testPostSchema }, testPostHandler)
    fastify.get('/test/secured', { onRequest: secured() }, testSecuredHandler)
    fastify.get('/test/admin', { onRequest: secured(['admin'])}, testSecuredHandler)
    fastify.get('/test/event', testEventHandler)
}

export default testRoute
