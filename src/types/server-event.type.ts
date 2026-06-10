import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { FastifyReply } from 'fastify';
import type { serverEventsTable } from '../db/schema.js';

export type ServerEvent = InferSelectModel<typeof serverEventsTable>;

export type CreateServerEvent = InferInsertModel<typeof serverEventsTable>;

export type UpdateServerEvent = { id: string } & InferInsertModel<typeof serverEventsTable>;

export type CreateServerEventBody = Pick<CreateServerEvent, 'type' | 'message'>;

export type UpdateServerEventBody = Pick<UpdateServerEvent, 'type' | 'message'>;

export type ServerEventClient = {
	id: string;
	reply: FastifyReply;
};

export type ServerEventType = 'info' | 'warning' | 'error';

export const SSE = {
	GLOBAL: 'global',
} as const;

export type SSEType = (typeof SSE)[keyof typeof SSE];
