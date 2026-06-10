import type { InferSelectModel } from 'drizzle-orm';
import type { apiKeysTable } from '../db/schema.js';

export type ApiKey = InferSelectModel<typeof apiKeysTable>;

export type CreateApiKey = { userId: string } & Pick<ApiKey, 'jwt' | 'jti'>;
