import { FastifyInstance } from 'fastify'
import { secured } from '../auth/auth.guard.js'
import {
	createUserHandler,
	deleteUserHandler,
	getUserHandler,
	getUsersHandler,
	updateUserHandler,
	getUserRolesHandler,
	createUserApiKeyHandler,
	deleteUserApiKeyHandler,
} from '../controllers/user.controller.js'
import {
	createUserApiKeySchema,
	createUserSchema,
	deleteUserApiKeySchema,
	deleteUserSchema,
	getUserRolesSchema,
	getUserSchema,
	getUsersSchema,
	updateUserSchema,
} from '../schema/user.schema.js'
import { Role } from '@prisma/client'

const userRoute = async (server: FastifyInstance) => {
	server.get('/users', { onRequest: secured([Role.ADMIN]), schema: getUsersSchema }, getUsersHandler)
	server.get('/user/roles', { onRequest: secured([Role.ADMIN]), schema: getUserRolesSchema }, getUserRolesHandler)
	server.get('/user/:id', { onRequest: secured([Role.ADMIN]), schema: getUserSchema }, getUserHandler)
	server.post('/user', { onRequest: secured([Role.ADMIN]), schema: createUserSchema }, createUserHandler)
	server.patch('/user/:id', { onRequest: secured([Role.ADMIN]), schema: updateUserSchema }, updateUserHandler)
	server.delete('/user/:id', { onRequest: secured([Role.ADMIN]), schema: deleteUserSchema }, deleteUserHandler)
	server.post('/user/:id/apiKey', { onRequest: secured(), schema: createUserApiKeySchema }, createUserApiKeyHandler)
	server.delete('/user/:id/apiKey', { onRequest: secured(), schema: deleteUserApiKeySchema }, deleteUserApiKeyHandler)
}

export default userRoute
