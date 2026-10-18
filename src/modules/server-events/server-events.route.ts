import type { FastifyPluginAsync } from 'fastify';
import { secured } from '../auth/auth.guard.js';
import {
  createServerEventHandler,
  deleteServerEventHandler,
  getServerEventsHandler,
  subscribeServerEventsHandler,
  updateServerEventHandler,
} from './server-events.controller.js';
import {
  createServerEventSchema,
  deleteServerEventSchema,
  getServerEventsSchema,
  updateServerEventSchema,
} from './server-events.schema.js';
import type { IdParam, PaginationQuery } from '../../types/request.type.js';
import type { CreateServerEventBody, UpdateServerEventBody } from './server-events.type.js';
import { Role } from '../user/user.type.js';

const serverEventsRoute: FastifyPluginAsync = async (server) => {
  server.get('/sse', { sse: true, schema: { hide: true } }, subscribeServerEventsHandler);
  server.get<{ Querystring: PaginationQuery }>(
    '/server-events',
    { onRequest: secured([Role.ADMIN]), schema: getServerEventsSchema },
    getServerEventsHandler,
  );
  server.post<{ Body: CreateServerEventBody }>(
    '/server-event',
    { onRequest: secured([Role.ADMIN]), schema: createServerEventSchema },
    createServerEventHandler,
  );
  server.patch<{ Params: IdParam; Body: UpdateServerEventBody }>(
    '/server-event/:id',
    { onRequest: secured([Role.ADMIN]), schema: updateServerEventSchema },
    updateServerEventHandler,
  );
  server.delete<{ Params: IdParam }>(
    '/server-event/:id',
    { onRequest: secured([Role.ADMIN]), schema: deleteServerEventSchema },
    deleteServerEventHandler,
  );
};

export default serverEventsRoute;
