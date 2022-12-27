import { JSONSchemaType } from 'ajv'
import { FastifySchema } from 'fastify'
import { ServerEventCreateBody, ServerEventUpdateBody } from '../types/server-event.type.js'
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
			blocked: { type: 'boolean', nullable: true },
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
			name: { type: 'string' },
			email: { type: 'string', format: 'email' },
			roles: {
				type: 'array',
				nullable: true,
				items: {
					type: 'string',
				},
			},
		},
		required: ['name', 'email'],
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
			id: { type: 'string', nullable: true },
			name: { type: 'string', nullable: true },
			email: { type: 'string', nullable: true, format: 'email' },
			blocked: { type: 'boolean', nullable: true },
			roles: {
				type: 'array',
				nullable: true,
				items: {
					type: 'string',
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
