import { FastifyPluginAsync } from 'fastify'
import { secured } from '../auth/auth.guard.js'
import { submitFeedbackHandler } from '../controllers/feedback.controller.js'
import { submitFeedbackSchema } from '../schema/feedback.schema.js'
import { FeedbackCreateBody } from '../types/feedback.type.js'

const feedbackRoute: FastifyPluginAsync = async (server) => {
	server.post<{ Body: FeedbackCreateBody }>('/feedback', { onRequest: secured(), schema: submitFeedbackSchema }, submitFeedbackHandler)
}

export default feedbackRoute
