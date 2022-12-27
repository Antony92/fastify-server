import { FastifyInstance } from 'fastify'
import { secured } from '../auth/auth.guard.js'
import { createUserHandler, deleteUserHandler, getUsersHandler, updateUserHandler } from '../controllers/user.controller.js'
import { createUserSchema, deleteUserSchema, getUserSchema, getUsersSchema, updateUserSchema } from '../schema/user.schema.js'
import { Roles } from '../types/user.type.js'

const userRoute = async (server: FastifyInstance) => {
	server.get('/users', { onRequest: secured([Roles.ADMIN]), schema: getUsersSchema }, getUsersHandler)
	server.get('/user/:id', { onRequest: secured([Roles.ADMIN]), schema: getUserSchema }, getUsersHandler)
	server.post('/user', { onRequest: secured([Roles.ADMIN]), schema: createUserSchema }, createUserHandler)
	server.patch('/user/:id', { onRequest: secured([Roles.ADMIN]), schema: updateUserSchema }, updateUserHandler)
	server.delete('/user/:id', { onRequest: secured([Roles.ADMIN]), schema: deleteUserSchema }, deleteUserHandler)
}

export default userRoute
