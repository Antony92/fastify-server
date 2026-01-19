import { Prisma } from '../db/prisma/client.js'
import prisma from '../db/prisma.js'

export const submitFeedback = async (feedback: Prisma.FeedbackCreateInput) => {
	await prisma.feedback.create({
		data: {
			...feedback,
		},
	})
}
