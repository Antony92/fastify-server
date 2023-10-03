import { FastifyPluginAsync } from 'fastify'
import { secured } from '../auth/auth.guard.js'
import { submitFeedbackHandler } from '../controllers/feedback.controller.js'
import { submitFeedbackSchema } from '../schema/feedback.schema.js'

const feedbackRoute: FastifyPluginAsync = async (server) => {
	server.post('/feedback', { onRequest: secured(), schema: submitFeedbackSchema }, submitFeedbackHandler)
}

export default feedbackRoute
