import { FastifyRequest, FastifyReply } from 'fastify'
import { createUser, deleteUser, getUser, getUsers, updateUser } from '../services/user.service.js'
import { UserCreateBody, UserSearchQuery, UserUpdateBody } from '../types/user.type.js'

export const getUserHandler = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
	const user = await getUser(request.params.id)
	return { data: user }
}

export const getUsersHandler = async (request: FastifyRequest<{ Querystring: UserSearchQuery }>, reply: FastifyReply) => {
	const users = await getUsers(request.query)
	return users
}

export const createUserHandler = async (request: FastifyRequest<{ Body: UserCreateBody }>, reply: FastifyReply) => {
	const user = await createUser(request.body)
	return { message: 'User created', data: user }
}

export const updateUserHandler = async (request: FastifyRequest<{ Body: UserUpdateBody }>, reply: FastifyReply) => {
	const user = await updateUser(request.body)
	return { message: 'User updated', data: user }
}

export const deleteUserHandler = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
	const user = await deleteUser(request.params.id)
	return {message: 'User deleted', data: user }
}
