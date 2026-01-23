import { getRoles } from '../services/user.service.js'
import { ServerSchema } from '../types/server.type.js'

export const getUserSchema: ServerSchema = {
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
	},
}

export const getRolesSchema: ServerSchema = {
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

export const getUsersSchema: ServerSchema = {
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
	},
}

export const createUserSchema: ServerSchema = {
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
			name: { type: 'string' },
			username: { type: 'string' },
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
	},
}

export const updateUserSchema: ServerSchema = {
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
	},
	body: {
		type: 'object',
		properties: {
			name: { type: 'string', nullable: true },
			username: { type: 'string', nullable: true },
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
	},
}

export const deleteUserSchema: ServerSchema = {
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
	},
}

export const createUserApiKeySchema: ServerSchema = {
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
	},
}

export const deleteUserApiKeySchema: ServerSchema = {
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
	},
}
