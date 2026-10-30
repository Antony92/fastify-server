import type { FastifyPluginAsync } from 'fastify';
import { secured } from '../auth/auth.guard.js';
import {
  createPersonalApiKeyHandler,
  createUserApiKeyHandler,
  deletePersonalApiKeyHandler,
  deleteUserApiKeyHandler,
} from './api-key.controller.js';
import { createUserApiKeySchema, deleteUserApiKeySchema } from './api-key.schema.js';
import type { IdParam } from '../../types/request.type.js';
import { Role } from '../user/user.type.js';

const apiKeyRoute: FastifyPluginAsync = async (server) => {
  server.post<{ Params: IdParam }>(
    '/user/:id/api-key',
    { onRequest: server.auth([secured([Role.ADMIN])]), schema: createUserApiKeySchema },
    createUserApiKeyHandler,
  );
  server.delete<{ Params: IdParam }>(
    '/user/:id/api-key',
    { onRequest: server.auth([secured([Role.ADMIN])]), schema: deleteUserApiKeySchema },
    deleteUserApiKeyHandler,
  );
  server.post(
    '/me/api-key',
    { onRequest: secured(), schema: { hide: true } },
    createPersonalApiKeyHandler,
  );
  server.delete<{ Params: IdParam }>(
    '/me/api-key',
    { onRequest: secured(), schema: { hide: true } },
    deletePersonalApiKeyHandler,
  );
};

export default apiKeyRoute;
