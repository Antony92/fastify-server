import { FastifyInstance } from 'fastify'
import { testGetHandler, testPostHandler, testSecuredHandler, testEventHandler, testGetByIdHandler } from '../controllers/test.controller'
import { secured } from '../auth/auth.guard'
import { testGetByIdSchema, testGetSchema, testSecuredSchema, testPostSchema, testAdminSchema } from '../schema/test.schema'

const testRoute = async (fastify: FastifyInstance) => {
	fastify.get('/test', { schema: testGetSchema }, testGetHandler)
	fastify.get('/test/:id', { schema: testGetByIdSchema }, testGetByIdHandler)
	fastify.post('/test', { schema: testPostSchema }, testPostHandler)
	fastify.get('/test/secured', { onRequest: secured(), schema: testSecuredSchema }, testSecuredHandler)
	fastify.get('/test/admin', { onRequest: secured(['admin']), schema: testAdminSchema }, testSecuredHandler)
	fastify.get('/test/event', testEventHandler)
}

export default testRoute
