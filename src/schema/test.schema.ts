import { FastifySchema } from 'fastify'

export const testPostSchema: FastifySchema = {
	tags: ['Test'],
	description: 'Test post route',
	consumes: ['application/json'],
	produces: ['application/json'],
	body: {
		type: 'object',
		required: ['number'],
		properties: {
			number: { type: 'number' },
			name: { type: 'string' }
		},
	},
}

export const testGetSchema: FastifySchema = {
	tags: ['Test'],
	description: 'Test get route',
	produces: ['application/json'],
}

export const testGetByIdSchema: FastifySchema = {
	tags: ['Test'],
	description: 'Test get by id route',
	produces: ['application/json'],
	params: {
		id: { type: 'number'}
	}
}

export const testUploadSchema: FastifySchema = {
	hide: true,
	tags: ['Test'],
	description: 'Test upload route',
	consumes: ['multipart/form-data'],
	produces: ['application/json']
}

export const testSecuredSchema: FastifySchema = {
	tags: ['Test'],
	description: 'Test secured route',
	produces: ['application/json'],
	security: [
		{
			apiKey: [],
			bearerAuth: []
		},
	],

}

export const testAdminSchema: FastifySchema = {
	tags: ['Test'],
	description: 'Test admin route',
	produces: ['application/json'],
	security: [
		{
			apiKey: [],
			bearerAuth: []
		},
	],
}
