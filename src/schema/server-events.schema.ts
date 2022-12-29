import { JSONSchemaType } from 'ajv'
import { FastifySchema } from 'fastify'
import { ServerEventBody } from '../types/server-event.type.js'

export const getServerEventsSchema: FastifySchema = {
	tags: ['Server events'],
	description: 'Get server events',
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
		}
	} satisfies JSONSchemaType<{ skip?: number, limit?: number }>
}

export const createServerEventSchema: FastifySchema = {
	tags: ['Server events'],
	description: 'Create server event',
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
			type: { type: 'string', enum: ['info', 'warning', 'danger'] },
			message: { type: 'string', maxLength: 500 },
		},
		required: ['type', 'message']
	} satisfies JSONSchemaType<ServerEventBody>
}

export const updateServerEventSchema: FastifySchema = {
	tags: ['Server events'],
	description: 'Update server event',
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
			id: { type: 'string' }
		},
		required: ['id']
	} satisfies JSONSchemaType<{ id: string }>,
	body: {
		type: 'object',
		properties: {
			type: { type: 'string', nullable: true, enum: ['info', 'warning', 'danger'] },
			message: { type: 'string', nullable: true, maxLength: 500 },
		}
	} satisfies JSONSchemaType<Partial<ServerEventBody>>
}

export const deleteServerEventSchema: FastifySchema = {
	tags: ['Server events'],
	description: 'Delete server event',
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
			id: { type: 'string' }
		},
		required: ['id']
	} satisfies JSONSchemaType<{ id: string }>
}