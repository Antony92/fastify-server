import { FastifySchema } from 'fastify'

export const testPostSchema: FastifySchema = {
	tags: ['Test'],
	description: 'Test post route',
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
}

export const testGetByIdSchema: FastifySchema = {
	tags: ['Test'],
	description: 'Test get by id route',
	params: {
		id: { type: 'number'}
	}
}

export const testSecuredSchema: FastifySchema = {
	tags: ['Test'],
	description: 'Test secured route',
	security: [
		{
			apiKey: [],
		},
	],

}

export const testAdminSchema: FastifySchema = {
	tags: ['Test'],
	description: 'Test admin reoute',
	security: [
		{
			apiKey: [],
		},
	],
}
