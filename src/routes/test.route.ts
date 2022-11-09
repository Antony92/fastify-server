import { FastifyInstance } from 'fastify'
import {
	testGetHandler,
	testPostHandler,
	testSecuredHandler,
	testGetByIdHandler,
	testUploadHandler,
	testAdminHandler,
} from '../controllers/test.controller'
import { secured } from '../auth/auth.guard'
import { testGetByIdSchema, testGetSchema, testSecuredSchema, testPostSchema, testAdminSchema, testUploadSchema } from '../schema/test.schema'
import { Roles } from '../models/user.model'

const testRoute = async (server: FastifyInstance) => {
	server.get('/test', { schema: testGetSchema }, testGetHandler)
	server.get('/test/:id', { schema: testGetByIdSchema }, testGetByIdHandler)
	server.post('/test', { schema: testPostSchema }, testPostHandler)
	server.post('/test/upload', { schema: testUploadSchema }, testUploadHandler)
	server.get('/test/secured', { onRequest: secured(), schema: testSecuredSchema }, testSecuredHandler)
	server.get('/test/admin', { onRequest: secured([Roles.ADMIN]), schema: testAdminSchema }, testAdminHandler)
}

export default testRoute
