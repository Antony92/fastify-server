import { InferInsertModel } from 'drizzle-orm';
import { feedbackTable } from '../../db/schema.js';
import { type Static } from 'typebox';
import { createFeedbackBodySchema } from './feedback.schema.js';

export type CreateFeedback = InferInsertModel<typeof feedbackTable>;

export type CreateFeedbackBody = Static<typeof createFeedbackBodySchema>;
