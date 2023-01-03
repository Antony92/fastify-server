import { Role } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'
import { auditLog } from '../services/audit-log.service.js'
import {
	createUser,
	deleteUser,
	getUserRoles,
	getUsers,
	updateUser,
	getUserById,
	createUserApiKey,
	deleteUserApiKey,
} from '../services/user.service.js'
import { AuditLogAction, AuditLogTarget } from '../types/audit-log.type.js'
import { UserCreateBody, UserSearchQuery, UserUpdateBody } from '../types/user.type.js'

export const getUserRolesHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	const roles = getUserRoles()
	return { data: roles }
}

export const getUserHandler = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
	const user = await getUserById(request.params.id)
	return { data: user }
}

export const getUsersHandler = async (request: FastifyRequest<{ Querystring: UserSearchQuery }>, reply: FastifyReply) => {
	const users = await getUsers(request.query)
	return users
}

export const createUserHandler = async (request: FastifyRequest<{ Body: UserCreateBody }>, reply: FastifyReply) => {
	const user = await createUser(request.body)

	await auditLog(request.user, AuditLogAction.CREATE, AuditLogTarget.USER, user)

	return { message: 'User created', data: user }
}

export const updateUserHandler = async (request: FastifyRequest<{ Params: { id: string }; Body: UserUpdateBody }>, reply: FastifyReply) => {
	const user = await updateUser(request.params.id, request.body)

	await auditLog(request.user, AuditLogAction.UPDATE, AuditLogTarget.USER, user)

	return { message: 'User updated', data: user }
}

export const deleteUserHandler = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
	const user = await deleteUser(request.params.id)

	await auditLog(request.user, AuditLogAction.DELETE, AuditLogTarget.USER, user)

	return { message: 'User deleted', data: user }
}

export const createUserApiKeyHandler = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
	const userId = request.user.roles.includes(Role.ADMIN) ? request.params.id : request.user.id

	const user = await getUserById(userId)

	const apiKey = await reply.accessJwtSign(
		{
			api: true,
			user: {
				id: user?.id,
				name: user?.name,
				username: user?.username,
				roles: user?.roles,
			}
		},
		{
			expiresIn: undefined
		}
	)

	const createdApiKey = await createUserApiKey(userId, apiKey)

	await auditLog(request.user, AuditLogAction.CREATE, AuditLogTarget.USER_API_KEY, createdApiKey)

	return { message: 'User api key created', data: apiKey }
}

export const deleteUserApiKeyHandler = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
	const userId = request.user.roles.includes(Role.ADMIN) ? request.params.id : request.user.id

	const deletedApiKey = await deleteUserApiKey(userId)

	await auditLog(request.user, AuditLogAction.DELETE, AuditLogTarget.USER_API_KEY, deletedApiKey)

	return { message: 'User api key deleted', data: deletedApiKey }
}
