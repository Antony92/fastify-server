import { InferInsertModel } from 'drizzle-orm';
import { feedbackTable } from '../../db/schema.js';
import { type Static, Type } from 'typebox';
import { createInsertSchema } from 'drizzle-orm/typebox';

export const createFeedbackBodySchema = Type.Pick(
  createInsertSchema(feedbackTable, {
    message: (schema) => Type.String({ ...schema, maxLength: 5000 }),
    satisfaction: (schema) => Type.Integer({ ...schema, minimum: 1, maximum: 5 }),
  }),
  ['satisfaction', 'message'],
);

export type CreateFeedback = InferInsertModel<typeof feedbackTable>;

export type CreateFeedbackBody = Static<typeof createFeedbackBodySchema>;
