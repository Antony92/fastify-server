import { Prisma } from '../db/prisma/client.js'

export type FeedbackCreateBody = Pick<Prisma.FeedbackCreateInput, 'satisfaction' | 'message'>
