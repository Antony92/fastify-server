import type { FastifyRequest } from 'fastify';
import { submitFeedback } from '../services/feedback.service.js';
import type { CreateFeedbackBody } from '../types/feedback.type.js';

export const submitFeedbackHandler = async (request: FastifyRequest<{ Body: CreateFeedbackBody }>) => {
	const { name, username } = request.user;
	const { satisfaction, message } = request.body;
	await submitFeedback({ name, email: username, satisfaction, message });
	return { message: 'Feedback submitted' };
};
