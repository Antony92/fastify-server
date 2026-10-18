import type { FastifySchema } from 'fastify';
import { createFeedbackBodySchema } from './feedback.type.js';

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
  body: createFeedbackBodySchema,
};
