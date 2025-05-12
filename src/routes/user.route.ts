import  { FastifyPluginAsync } from 'fastify'
import { secured } from '../auth/auth.guard.js'
import {
	createUserHandler,
	deleteUserHandler,
	getUserHandler,
	getUsersHandler,
	updateUserHandler,
	getRolesHandler,
	getUserProfileHandler,
	createUserApiKeyHandler,
	deleteUserApiKeyHandler,
	createPersonalApiKeyHandler,
	deletePersonalApiKeyHandler,
} from '../controllers/user.controller.js'
import {
	createUserApiKeySchema,
	createUserSchema,
	deleteUserApiKeySchema,
	deleteUserSchema,
	getRolesSchema,
	getUserSchema,
	getUsersSchema,
	updateUserSchema,
} from '../schema/user.schema.js'
import { Role } from '../types/user.type.js'

const userRoute: FastifyPluginAsync = async (server) => {
	server.get('/users', { onRequest: secured(), schema: getUsersSchema }, getUsersHandler)
	server.get('/roles', { onRequest: secured([Role.ADMIN]), schema: getRolesSchema }, getRolesHandler)
	server.get('/user/:id', { onRequest: secured([Role.ADMIN]), schema: getUserSchema }, getUserHandler)
	server.post('/user', { onRequest: secured([Role.ADMIN]), schema: createUserSchema }, createUserHandler)
	server.patch('/user/:id', { onRequest: secured([Role.ADMIN]), schema: updateUserSchema }, updateUserHandler)
	server.delete('/user/:id', { onRequest: secured([Role.ADMIN]), schema: deleteUserSchema }, deleteUserHandler)
	server.post('/user/:id/api-key', { onRequest: secured([Role.ADMIN]), schema: createUserApiKeySchema }, createUserApiKeyHandler)
	server.delete('/user/:id/api-key', { onRequest: secured([Role.ADMIN]), schema: deleteUserApiKeySchema }, deleteUserApiKeyHandler)
	// logged user
	server.get('/me', { onRequest: secured(), schema: { hide: true } }, getUserProfileHandler)
	server.post('/me/api-key', { onRequest: secured(), schema: { hide: true } }, createPersonalApiKeyHandler)
	server.delete('/me/api-key', { onRequest: secured(), schema: { hide: true } }, deletePersonalApiKeyHandler)
}

export default userRoute
