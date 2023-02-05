import { FastifyPluginAsync } from 'fastify'
import { secured } from '../auth/auth.guard.js'
import {
	createUserHandler,
	deleteUserHandler,
	getUserHandler,
	getUsersHandler,
	updateUserHandler,
	getRolesHandler,
} from '../controllers/user.controller.js'
import {
	createUserSchema,
	deleteUserSchema,
	getRolesSchema,
	getUserSchema,
	getUsersSchema,
	updateUserSchema,
} from '../schema/user.schema.js'
import { Role } from '@prisma/client'

const userRoute: FastifyPluginAsync = async (server) => {
	server.get('/users', { onRequest: secured([Role.ADMIN]), schema: getUsersSchema }, getUsersHandler)
	server.get('/roles', { onRequest: secured([Role.ADMIN]), schema: getRolesSchema }, getRolesHandler)
	server.get('/user/:id', { onRequest: secured([Role.ADMIN]), schema: getUserSchema }, getUserHandler)
	server.post('/user', { onRequest: secured([Role.ADMIN]), schema: createUserSchema }, createUserHandler)
	server.patch('/user/:id', { onRequest: secured([Role.ADMIN]), schema: updateUserSchema }, updateUserHandler)
	server.delete('/user/:id', { onRequest: secured([Role.ADMIN]), schema: deleteUserSchema }, deleteUserHandler)
}

export default userRoute
