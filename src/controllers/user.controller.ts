import { FastifyRequest, FastifyReply } from 'fastify'
import { auditLog } from '../services/audit-log.service.js'
import { createUser, deleteUser, getRoles, getUsers, updateUser, getUserById, getUserProfile } from '../services/user.service.js'
import { AuditLogAction, AuditLogTarget } from '../types/audit-log.type.js'
import { UserCreateBody, UserSearchQuery, UserUpdateBody } from '../types/user.type.js'
import { createApiKey, deleteApiKeyByUserId } from '../services/api-key.service.js'
import crypto from 'crypto'

export const getRolesHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	const roles = getRoles()
	return { data: roles }
}

export const getUserHandler = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
	const user = await getUserById(request.params.id)
	return { data: user }
}

export const getUsersHandler = async (request: FastifyRequest<{ Querystring: UserSearchQuery }>, reply: FastifyReply) => {
	const { users, total } = await getUsers(request.query)
	return { data: users, total }
}

export const createUserHandler = async (request: FastifyRequest<{ Body: UserCreateBody }>, reply: FastifyReply) => {
	const user = await createUser({ ...request.body, internal: true })
	await auditLog(request.user, AuditLogAction.CREATE, AuditLogTarget.USER, { body: request.body, user }, 'create user')
	return { message: 'User created', data: user }
}

export const updateUserHandler = async (request: FastifyRequest<{ Params: { id: string }; Body: UserUpdateBody }>, reply: FastifyReply) => {
	const { id } = request.params
	const user = await updateUser({ id, ...request.body })
	await auditLog(request.user, AuditLogAction.UPDATE, AuditLogTarget.USER, { id, body: request.body, user }, 'update user')
	return { message: 'User updated', data: user }
}

export const deleteUserHandler = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
	const user = await deleteUser(request.params.id)
	await auditLog(request.user, AuditLogAction.DELETE, AuditLogTarget.USER, user, 'delete user')
	return { message: 'User deleted', data: user }
}

export const getUserProfileHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	const profile = await getUserProfile(request.user.id)
	return { data: profile }
}

export const createUserApiKeyHandler = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
	const user = await getUserById(request.params.id)
	const jti = crypto.randomUUID()
	const jwt = await reply.accessJwtSign(
		{
			user: {
				id: user.id,
				name: user.name,
				username: user.username,
				roles: user.roles,
			},
			api: true,
		},
		{
			jti,
			expiresIn: 0,
		}
	)
	const apiKey = await createApiKey({
		jwt,
		jti,
		userId: user.id,
	})
	await auditLog(request.user, AuditLogAction.CREATE, AuditLogTarget.USER, { user, apiKey }, 'create user api key')
	return { message: 'API key created', data: apiKey }
}

export const deleteUserApiKeyHandler = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
	const apiKey = await deleteApiKeyByUserId(request.params.id)
	await auditLog(request.user, AuditLogAction.DELETE, AuditLogTarget.USER, apiKey, 'delete user api key')
	return { message: 'API key deleted', data: apiKey.id }
}

export const createPersonalApiKeyHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	const jti = crypto.randomUUID()
	const jwt = await reply.accessJwtSign(
		{
			user: request.user,
			api: true,
		},
		{
			jti,
			expiresIn: 0,
		}
	)
	const apiKey = await createApiKey({
		jwt,
		jti,
		userId: request.user.id,
	})
	await auditLog(request.user, AuditLogAction.CREATE, AuditLogTarget.USER, apiKey, 'create personal api key')
	return { message: 'API key created', data: apiKey }
}

export const deletePersonalApiKeyHandler = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
	const apiKey = await deleteApiKeyByUserId(request.user.id)
	await auditLog(request.user, AuditLogAction.DELETE, AuditLogTarget.USER, apiKey, 'delete personal api key')
	return { message: 'API key deleted', data: apiKey.id }
}
