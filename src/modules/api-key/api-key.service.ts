import { eq, getTableColumns } from 'drizzle-orm';
import db from '../../db/index.js';
import { apiKeysTable } from '../../db/schema.js';
import type { CreateApiKey } from './api-key.type.js';

export const createApiKey = async (apiKey: CreateApiKey) => {
  const [createdApiKey] = await db
    .insert(apiKeysTable)
    .values(apiKey)
    .onConflictDoUpdate({ target: apiKeysTable.userId, set: apiKey })
    .returning();
  return createdApiKey;
};

export const deleteApiKeyByUserId = async (userId: string) => {
  const { jti: _jti, ...columns } = getTableColumns(apiKeysTable);
  const [deletedApiKey] = await db
    .delete(apiKeysTable)
    .where(eq(apiKeysTable.userId, userId))
    .returning(columns);
  return deletedApiKey;
};
