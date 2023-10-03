import prisma from '../db/prisma.js'
import { ApiKeyCreateInput } from '../types/api-key.type.js'

export const createApiKey = async (apiKey: ApiKeyCreateInput) => {
	const createdApiKey = await prisma.apiKey.create({
		data: {
			...apiKey,
		},
	})
	return createdApiKey
}

export const deleteApiKeyByUserId = async (userId: string) => {
	const deletedApiKey = await prisma.apiKey.delete({
		where: {
			userId,
		},
	})
	return deletedApiKey
}

export const getApiKeyByUserId = async (userId: string) => {
	const apiKey = await prisma.apiKey.findUnique({
		where: {
			userId,
		},
	})
	return apiKey
}
