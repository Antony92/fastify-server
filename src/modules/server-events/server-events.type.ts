import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { FastifyReply } from 'fastify';
import { serverEventsTable } from '../../db/schema.js';
import { Type, type Static } from 'typebox';
import { createInsertSchema, createUpdateSchema } from 'drizzle-orm/typebox';

export const createServerEventBodySchema = Type.Pick(
  createInsertSchema(serverEventsTable, {
    message: (schema) => Type.String({ ...schema, maxLength: 500 }),
  }),
  ['type', 'message'],
);

export const updateServerEventBodySchema = Type.Pick(
  createUpdateSchema(serverEventsTable, {
    message: (schema) => Type.String({ ...schema, maxLength: 500 }),
  }),
  ['type', 'message'],
);

export type ServerEvent = InferSelectModel<typeof serverEventsTable>;

export type CreateServerEvent = InferInsertModel<typeof serverEventsTable>;

export type UpdateServerEvent = { id: string } & Partial<
  InferInsertModel<typeof serverEventsTable>
>;

export type CreateServerEventBody = Static<typeof createServerEventBodySchema>;

export type UpdateServerEventBody = Static<typeof updateServerEventBodySchema>;

export type ServerEventClient = {
  id: string;
  reply: FastifyReply;
};

export type ServerEventType = 'info' | 'warning' | 'error';

export const SSE = {
  GLOBAL: 'global',
} as const;

export type SSEType = (typeof SSE)[keyof typeof SSE];
