import  { FastifyRequest } from 'fastify'
import { FeedbackCreateBody } from '../types/feedback.type.js'
import { submitFeedback } from '../services/feedback.service.js'

export const submitFeedbackHandler = async (request: FastifyRequest) => {
    const { name, username } = request.user
    const { satisfaction, message } = request.body as FeedbackCreateBody
	await submitFeedback({ name, email: username, satisfaction, message })
	return { message: 'Feedback submitted' }
}
