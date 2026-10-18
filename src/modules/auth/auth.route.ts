import type { FastifyPluginAsync } from 'fastify';
import { secured } from './auth.guard.js';
import {
  impersonateHandler,
  loginCallbackHandler,
  logoutHandler,
  refreshHandler,
} from './auth.controller.js';
import { Role } from '../user/user.type.js';

const authRoute: FastifyPluginAsync = async (server) => {
  server.post(
    '/auth/logout',
    { config: { rateLimit: { max: 10, timeWindow: '15 minutes' } }, schema: { hide: true } },
    logoutHandler,
  );
  server.get(
    '/auth/refresh',
    { config: { rateLimit: { max: 10, timeWindow: '15 minutes' } }, schema: { hide: true } },
    refreshHandler,
  );
  server.get(
    '/auth/login/callback',
    { config: { rateLimit: { max: 10, timeWindow: '15 minutes' } }, schema: { hide: true } },
    loginCallbackHandler,
  );
  server.post(
    '/auth/impersonate',
    { onRequest: secured([Role.ADMIN]), schema: { hide: true } },
    impersonateHandler,
  );
};

export default authRoute;
