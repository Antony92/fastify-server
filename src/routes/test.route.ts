import { FastifyInstance } from 'fastify'
import { testGetHandler, testPostHandler, testSecuredHandler, testEventHandler } from '../controllers/test.controller'
import { secured } from '../auth/auth.guard'
import { testSchemaBody } from '../schema/test.schema'

const testRoute = async (fastify: FastifyInstance) => {
    fastify.get('/test/get/:id', testGetHandler)
    fastify.post('/test/post', { schema: testSchemaBody }, testPostHandler)
    fastify.get('/test/secured', { onRequest: secured() }, testSecuredHandler)
    fastify.get('/test/admin', { onRequest: secured(['admin'])}, testSecuredHandler)
    fastify.get('/test/event', testEventHandler)
}

export default testRoute