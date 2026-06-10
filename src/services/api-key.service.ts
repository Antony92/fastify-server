import { eq } from 'drizzle-orm';
import db from '../db/index.js';
import { apiKeysTable } from '../db/schema.js';
import type { CreateApiKey } from '../types/api-key.type.js';

export const createApiKey = async (apiKey: CreateApiKey) => {
	const [createdApiKey] = await db.insert(apiKeysTable).values(apiKey).returning();
	return createdApiKey;
};

export const deleteApiKeyByUserId = async (userId: string) => {
	const [deletedApiKey] = await db.delete(apiKeysTable).where(eq(apiKeysTable.userId, userId)).returning();
	return deletedApiKey;
};

export const getApiKeyByUserId = async (userId: string) => {
	const apiKey = await db.query.apiKeysTable.findFirst({
		where: {
			userId,
		},
	});
	if (!apiKey) {
		throw new Error(`API key for user '${userId}' not found`);
	}
	return apiKey;
};
