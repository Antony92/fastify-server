import { FastifyInstance } from 'fastify'
import { testGetHandler, testPostHandler, testSecuredHandler, testEventHandler, testLoginHandler } from '../controllers/test.controller'
import { secured } from '../auth/auth.guard'
import { testSchemaBody } from '../schema/test.schema'

const testRoute = async (fastify: FastifyInstance) => {
    fastify.get('/test/:id', testGetHandler)
    fastify.post('/test', { schema: testSchemaBody }, testPostHandler)
    fastify.get('/test/login', testLoginHandler)
    fastify.get('/test/secured', { onRequest: secured() }, testSecuredHandler)
    fastify.get('/test/admin', { onRequest: secured(['admin'])}, testSecuredHandler)
    fastify.get('/test/event', testEventHandler)
}

export default testRoute
