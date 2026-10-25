import { apiKeysTable } from '../../db/schema.js';
import { createInsertSchema } from 'drizzle-orm/typebox';
import { type Static, Type } from 'typebox';

export const createApiKeySchema = Type.Omit(createInsertSchema(apiKeysTable), ['id', 'created']);

export type CreateApiKey = Static<typeof createApiKeySchema>;
