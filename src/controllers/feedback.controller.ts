import { FastifyReply, FastifyRequest } from 'fastify'
import { FeedbackCreateBody } from '../types/feedback.type.js'
import { submitFeedback } from '../services/feedback.service.js'

export const submitFeedbackHandler = async (request: FastifyRequest<{ Body: FeedbackCreateBody }>, reply: FastifyReply) => {
    const { name, username } = request.user
    const { satisfaction, message } = request.body
	await submitFeedback({ name, email: username, satisfaction, message })
	return { message: 'Feedback submitted' }
}
