import type { FastifySchema } from 'fastify';
import { Type } from 'typebox';
import { feedbackTable } from '../../db/schema.js';
import { createInsertSchema } from 'drizzle-orm/typebox';

export const createFeedbackBodySchema = Type.Pick(
  createInsertSchema(feedbackTable, {
    message: (schema) => Type.String({ ...schema, maxLength: 5000 }),
    satisfaction: (schema) => Type.Integer({ ...schema, minimum: 1, maximum: 5 }),
  }),
  ['satisfaction', 'message'],
);

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
