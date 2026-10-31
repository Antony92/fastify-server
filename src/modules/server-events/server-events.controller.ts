import crypto from 'node:crypto';
import type { FastifyReply, FastifyRequest } from 'fastify';
import sanitizeHtml from 'sanitize-html';
import { auditLogs } from '../audit-logs/audit-logs.service.js';
import {
  createServerEvent,
  deleteServerEvent,
  getServerEvents,
  updateServerEvent,
} from './server-events.service.js';
import { AuditLogsAction, AuditLogsTarget } from '../audit-logs/audit-logs.type.js';
import type { IdParam, PaginationQuery } from '../../types/request.type.js';
import {
  ServerEventScope,
  type CreateServerEventBody,
  type UpdateServerEventBody,
} from './server-events.type.js';

export const subscribeServerEventsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  let id = request.user?.id || crypto.randomUUID();
  request.server.sseClients.add(id, reply);

  const {
    events: [event],
  } = await getServerEvents(ServerEventScope.GLOBAL);
  if (event) {
    request.server.sseClients.send(id, { event: event.scope, data: event });
  } else {
    await reply.sse.send({ data: 'connected' });
  }

  reply.sse.onClose(() => {
    request.server.sseClients.remove(id);
  });
};

export const getServerEventsHandler = async (
  request: FastifyRequest<{ Querystring: PaginationQuery }>,
) => {
  const { search, skip, limit } = request.query;
  const { events, total } = await getServerEvents(search as ServerEventScope, skip, limit);
  return { data: events, total };
};

export const createServerEventHandler = async (
  request: FastifyRequest<{ Body: CreateServerEventBody }>,
) => {
  const body = request.body;
  body.message = sanitizeHtml(body.message, {
    allowedTags: ['a'],
    allowedAttributes: {
      a: ['href', 'target'],
    },
  });
  const event = await createServerEvent(body);
  request.server.sseClients.sendAll({ event: event.scope, data: event });
  await auditLogs(
    request.user,
    AuditLogsAction.CREATE,
    AuditLogsTarget.SERVER_EVENT,
    event,
    'server event created',
  );
  return { data: event, message: 'Server event created' };
};

export const updateServerEventHandler = async (
  request: FastifyRequest<{ Params: IdParam; Body: UpdateServerEventBody }>,
) => {
  const { id } = request.params;
  const body = request.body;
  body.message = sanitizeHtml(body.message as string, {
    allowedTags: ['a'],
    allowedSchemes: ['https'],
    allowedAttributes: {
      a: ['href', 'target'],
    },
  });
  const event = await updateServerEvent({ id, ...body });
  request.server.sseClients.sendAll({ event: event.scope, data: event });
  await auditLogs(
    request.user,
    AuditLogsAction.UPDATE,
    AuditLogsTarget.SERVER_EVENT,
    event,
    'server event updated',
  );
  return { data: event, message: 'Server event updated' };
};

export const deleteServerEventHandler = async (request: FastifyRequest<{ Params: IdParam }>) => {
  const { id } = request.params;
  const event = await deleteServerEvent(id);
  await auditLogs(
    request.user,
    AuditLogsAction.DELETE,
    AuditLogsTarget.SERVER_EVENT,
    event,
    'server event deleted',
  );
  return { data: event, message: 'Server event deleted' };
};
