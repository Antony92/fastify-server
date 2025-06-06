import { FastifySchema } from 'fastify'
import { FeedbackCreateBody } from '../types/feedback.type.js'
import { JSONSchemaType } from 'ajv'

export const submitFeedbackSchema: FastifySchema = {
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
            message: { type: 'string', maxLength: 5000, transform: ['trim'] },
        },
        required: ['satisfaction', 'message'],
    } satisfies JSONSchemaType<FeedbackCreateBody>,
}
