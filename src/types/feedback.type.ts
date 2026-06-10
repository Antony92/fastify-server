import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { feedbackTable } from '../db/schema.js';

export type Feedback = InferSelectModel<typeof feedbackTable>;

export type CreateFeedback = InferInsertModel<typeof feedbackTable>;

export type CreateFeedbackBody = Pick<Feedback, 'satisfaction' | 'message'>;
