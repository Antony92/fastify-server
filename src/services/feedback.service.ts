import db from '../db/index.js';
import { feedbackTable } from '../db/schema.js';
import type { CreateFeedback } from '../types/feedback.type.js';

export const submitFeedback = async (feedback: CreateFeedback) => {
	const [submittedFeedback] = await db.insert(feedbackTable).values(feedback).returning();
	return submittedFeedback;
};
