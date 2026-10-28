import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { FastifyReply } from 'fastify';
import { serverEventsTable } from '../../db/schema.js';
import { type Static } from 'typebox';
import {
  createServerEventBodySchema,
  updateServerEventBodySchema,
} from './server-events.schema.js';

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

export type ServerEventSeverity = 'info' | 'warning' | 'error';

export const ServerEventScope = {
  GLOBAL: 'global',
} as const;

export type ServerEventScope = (typeof ServerEventScope)[keyof typeof ServerEventScope];
