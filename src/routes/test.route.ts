import { FastifyInstance } from 'fastify'
import {
	testGetHandler,
	testPostHandler,
	testSecuredHandler,
	testEventHandler,
	testGetByIdHandler,
	testUploadHandler,
} from '../controllers/test.controller'
import { secured } from '../auth/auth.guard'
import { testGetByIdSchema, testGetSchema, testSecuredSchema, testPostSchema, testAdminSchema, testUploadSchema } from '../schema/test.schema'
import { Roles } from '../models/user.model'

const testRoute = async (fastify: FastifyInstance) => {
	fastify.get('/test', { schema: testGetSchema }, testGetHandler)
	fastify.get('/test/:id', { schema: testGetByIdSchema }, testGetByIdHandler)
	fastify.post('/test', { schema: testPostSchema }, testPostHandler)
	fastify.post('/test/upload', { schema: testUploadSchema }, testUploadHandler)
	fastify.get('/test/secured', { onRequest: secured(), schema: testSecuredSchema }, testSecuredHandler)
	fastify.get('/test/admin', { onRequest: secured([Roles.ADMIN]), schema: testAdminSchema }, testSecuredHandler)
	fastify.get('/test/event', { schema: { hide: true } }, testEventHandler)
}

export default testRoute
