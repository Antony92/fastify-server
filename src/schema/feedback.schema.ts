import { ServerSchema } from '../types/server.type.js'

export const submitFeedbackSchema: ServerSchema = {
	tags: ['Feedback'],
	hide: true,
	description: 'Submit feedback',
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
			satisfaction: { type: 'number', minimum: 1, maximum: 5 },
			message: { type: 'string', maxLength: 5000 },
		},
		required: ['satisfaction', 'message'],
	},
}
