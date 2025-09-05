import { Prisma } from '@prisma/client'

export type FeedbackCreateBody = Pick<Prisma.FeedbackCreateInput, 'satisfaction' | 'message'>
