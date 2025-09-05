import { Prisma } from '@prisma/client'
import prisma from '../db/prisma.js'

export const submitFeedback = async (feedback: Prisma.FeedbackCreateInput) => {
	await prisma.feedback.create({
		data: {
			...feedback,
		},
	})
}
