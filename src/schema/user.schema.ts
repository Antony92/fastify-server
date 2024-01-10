import { JSONSchemaType } from 'ajv'
import { FastifySchema } from 'fastify'
import { getRoles } from '../services/user.service.js'
import { UserCreateBody, UserSearchQuery, UserUpdateBody } from '../types/user.type.js'

export const getUserSchema: FastifySchema = {
	tags: ['User'],
	description: 'Get user',
	consumes: ['application/json'],
	produces: ['application/json'],
	security: [
		{
			bearerAuth: [],
		},
	],
	params: {
		type: 'object',
		properties: {
			id: { type: 'string' },
		},
		required: ['id'],
	} satisfies JSONSchemaType<{ id: string }>,
}

export const getRolesSchema: FastifySchema = {
	tags: ['User'],
	description: 'Get roles',
	consumes: ['application/json'],
	produces: ['application/json'],
	security: [
		{
			bearerAuth: [],
		},
	],
}

export const getUsersSchema: FastifySchema = {
	tags: ['User'],
	description: 'Get users',
	consumes: ['application/json'],
	produces: ['application/json'],
	security: [
		{
			bearerAuth: [],
		},
	],
	querystring: {
		type: 'object',
		properties: {
			skip: { type: 'number', nullable: true, minimum: 0 },
			limit: { type: 'number', nullable: true, default: 10, maximum: 50 },
			search: { type: 'string', nullable: true },
			name: { type: 'string', nullable: true },
			username: { type: 'string', nullable: true },
			active: { type: 'boolean', nullable: true },
			blocked: { type: 'boolean', nullable: true },
			internal: { type: 'boolean', nullable: true },
			roles: { type: 'string', nullable: true },
			sort: { type: 'string', nullable: true },
            order: { type: 'string', nullable: true },
		},
	} satisfies JSONSchemaType<UserSearchQuery>,
}

export const createUserSchema: FastifySchema = {
	tags: ['User'],
	description: 'Create user',
	consumes: ['application/json'],
	produces: ['application/json'],
	security: [
		{
			bearerAuth: [],
		},
	],
	body: {
		type: 'object',
		properties: {
			name: { type: 'string', transform: ['trim'] },
			username: { type: 'string', transform: ['trim'] },
			active: { type: 'boolean', nullable: true, default: true },
			blocked: { type: 'boolean', nullable: true, default: false },
			roles: {
				type: 'array',
				nullable: true,
				default: ['GUEST'],
				items: {
					type: 'string',
					enum: getRoles(),
				},
			},
		},
		required: ['name', 'username'],
	} satisfies JSONSchemaType<UserCreateBody>,
}

export const updateUserSchema: FastifySchema = {
	tags: ['User'],
	description: 'Update user',
	consumes: ['application/json'],
	produces: ['application/json'],
	security: [
		{
			bearerAuth: [],
		},
	],
	params: {
		type: 'object',
		properties: {
			id: { type: 'string' },
		},
		required: ['id'],
	} satisfies JSONSchemaType<{ id: string }>,
	body: {
		type: 'object',
		properties: {
			name: { type: 'string', nullable: true, transform: ['trim'] },
			username: { type: 'string', nullable: true, transform: ['trim'] },
			active: { type: 'boolean', nullable: true },
			blocked: { type: 'boolean', nullable: true },
			roles: {
				type: 'array',
				nullable: true,
				items: {
					type: 'string',
					enum: getRoles(),
				},
			},
		},
	} satisfies JSONSchemaType<UserUpdateBody>,
}

export const deleteUserSchema: FastifySchema = {
	tags: ['User'],
	description: 'Delete user',
	consumes: ['application/json'],
	produces: ['application/json'],
	security: [
		{
			bearerAuth: [],
		},
	],
	params: {
		type: 'object',
		properties: {
			id: { type: 'string' },
		},
		required: ['id'],
	} satisfies JSONSchemaType<{ id: string }>,
}

export const createUserApiKeySchema: FastifySchema = {
	tags: ['User'],
	description: 'Create user api key',
	consumes: ['application/json'],
	produces: ['application/json'],
	security: [
		{
			bearerAuth: [],
		},
	],
	params: {
		type: 'object',
		properties: {
			id: { type: 'string' },
		},
		required: ['id'],
	} satisfies JSONSchemaType<{ id: string }>,
}

export const deleteUserApiKeySchema: FastifySchema = {
	tags: ['User'],
	description: 'Delete user api key',
	consumes: ['application/json'],
	produces: ['application/json'],
	security: [
		{
			bearerAuth: [],
		},
	],
	params: {
		type: 'object',
		properties: {
			id: { type: 'string' },
		},
		required: ['id'],
	} satisfies JSONSchemaType<{ id: string }>,
}