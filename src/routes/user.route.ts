import { FastifyPluginAsync } from 'fastify'
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
import { Role, UserCreateBody, UserSearchQuery, UserUpdateBody } from '../types/user.type.js'
import { IdParam } from '../types/request.type.js'

const userRoute: FastifyPluginAsync = async (server) => {
	server.get<{ Querystring: UserSearchQuery }>('/users', { onRequest: secured(), schema: getUsersSchema }, getUsersHandler)
	server.get('/roles', { onRequest: secured([Role.ADMIN]), schema: getRolesSchema }, getRolesHandler)
	server.get<{ Params: IdParam }>('/user/:id', { onRequest: secured([Role.ADMIN]), schema: getUserSchema }, getUserHandler)
	server.post<{ Body: UserCreateBody }>('/user', { onRequest: secured([Role.ADMIN]), schema: createUserSchema }, createUserHandler)
	server.patch<{ Params: IdParam; Body: UserUpdateBody }>(
		'/user/:id',
		{ onRequest: secured([Role.ADMIN]), schema: updateUserSchema },
		updateUserHandler,
	)
	server.delete<{ Params: IdParam }>('/user/:id', { onRequest: secured([Role.ADMIN]), schema: deleteUserSchema }, deleteUserHandler)
	server.post<{ Params: IdParam }>(
		'/user/:id/api-key',
		{ onRequest: secured([Role.ADMIN]), schema: createUserApiKeySchema },
		createUserApiKeyHandler,
	)
	server.delete<{ Params: IdParam }>(
		'/user/:id/api-key',
		{ onRequest: secured([Role.ADMIN]), schema: deleteUserApiKeySchema },
		deleteUserApiKeyHandler,
	)
	// logged user
	server.get('/me', { onRequest: secured(), schema: { hide: true } }, getUserProfileHandler)
	server.post('/me/api-key', { onRequest: secured(), schema: { hide: true } }, createPersonalApiKeyHandler)
	server.delete<{ Params: IdParam }>('/me/api-key', { onRequest: secured(), schema: { hide: true } }, deletePersonalApiKeyHandler)
}

export default userRoute
