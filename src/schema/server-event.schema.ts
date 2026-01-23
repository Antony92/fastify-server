import { ServerSchema } from '../types/server.type.js'

export const getServerEventsSchema: ServerSchema = {
	tags: ['Server event'],
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
		},
	},
}

export const createServerEventSchema: ServerSchema = {
	tags: ['Server event'],
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
			type: { type: 'string', nullable: true, enum: ['info', 'warning', 'error'] },
			message: { type: 'string', maxLength: 500 },
		},
		required: ['message'],
	},
}

export const updateServerEventSchema: ServerSchema = {
	tags: ['Server event'],
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
			id: { type: 'string' },
		},
		required: ['id'],
	},
	body: {
		type: 'object',
		properties: {
			type: { type: 'string', nullable: true, enum: ['info', 'warning', 'error'] },
			message: { type: 'string', nullable: true, maxLength: 500 },
		},
	},
}

export const deleteServerEventSchema: ServerSchema = {
	tags: ['Server event'],
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
			id: { type: 'string' },
		},
		required: ['id'],
	},
}
