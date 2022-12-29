import { FastifyRequest, FastifyReply } from 'fastify'
import { auditLog } from '../services/audit-log.service.js'
import { createUser, deleteUser, getUserRoles, getUser, getUsers, updateUser } from '../services/user.service.js'
import { AuditLogAction, AuditLogTarget } from '../types/audit-log.type.js'
import { UserBody, UserSearchQuery } from '../types/user.type.js'

export const getUserRolesHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	const roles = getUserRoles()
	return { data: roles }
}

export const getUserHandler = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
	const user = await getUser(request.params.id)
	return { data: user }
}

export const getUsersHandler = async (request: FastifyRequest<{ Querystring: UserSearchQuery }>, reply: FastifyReply) => {
	const users = await getUsers(request.query)
	return users
}

export const createUserHandler = async (request: FastifyRequest<{ Body: UserBody }>, reply: FastifyReply) => {
	const user = await createUser(request.body)

	await auditLog(request.user, AuditLogAction.CREATE, AuditLogTarget.USER, user)

	return { message: 'User created', data: user }
}

export const updateUserHandler = async (request: FastifyRequest<{ Params: { id: string }, Body: Partial<UserBody> }>, reply: FastifyReply) => {
	const user = await updateUser(request.params.id, request.body)

	await auditLog(request.user, AuditLogAction.UPDATE, AuditLogTarget.USER, user)

	return { message: 'User updated', data: user }
}

export const deleteUserHandler = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
	const user = await deleteUser(request.params.id)

	await auditLog(request.user, AuditLogAction.DELETE, AuditLogTarget.USER, user)

	return {message: 'User deleted', data: user }
}
