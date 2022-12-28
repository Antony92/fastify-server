import { FastifyInstance } from 'fastify'
import { secured } from '../auth/auth.guard.js'
import {
	createUserHandler,
	deleteUserHandler,
	getUserHandler,
	getUsersHandler,
	updateUserHandler,
	getUserRolesHandler,
} from '../controllers/user.controller.js'
import { createUserSchema, deleteUserSchema, getUserRolesSchema, getUserSchema, getUsersSchema, updateUserSchema } from '../schema/user.schema.js'
import { Role } from '../types/user.type.js'

const userRoute = async (server: FastifyInstance) => {
	server.get('/users', { onRequest: secured([Role.ADMIN]), schema: getUsersSchema }, getUsersHandler)
	server.get('/user/roles', { onRequest: secured([Role.ADMIN]), schema: getUserRolesSchema }, getUserRolesHandler)
	server.get('/user/:id', { onRequest: secured([Role.ADMIN]), schema: getUserSchema }, getUserHandler)
	server.post('/user', { onRequest: secured([Role.ADMIN]), schema: createUserSchema }, createUserHandler)
	server.patch('/user/:id', { onRequest: secured([Role.ADMIN]), schema: updateUserSchema }, updateUserHandler)
	server.delete('/user/:id', { onRequest: secured([Role.ADMIN]), schema: deleteUserSchema }, deleteUserHandler)
}

export default userRoute
