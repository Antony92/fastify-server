import type { FastifyPluginAsync } from 'fastify';
import { secured } from '../auth/auth.guard.js';
import {
  createUserHandler,
  deleteUserHandler,
  getRolesHandler,
  getUserHandler,
  getUserProfileHandler,
  getUsersHandler,
  updateUserHandler,
} from './user.controller.js';
import {
  createUserSchema,
  deleteUserSchema,
  getRolesSchema,
  getUserSchema,
  getUsersSchema,
  updateUserSchema,
} from './user.schema.js';
import type { IdParam } from '../../types/request.type.js';
import {
  type CreateUserBody,
  Role,
  type UpdateUserBody,
  type UserSearchQuery,
} from './user.type.js';

const userRoute: FastifyPluginAsync = async (server) => {
  server.get<{ Querystring: UserSearchQuery }>(
    '/users',
    { onRequest: secured(), schema: getUsersSchema },
    getUsersHandler,
  );
  server.get(
    '/roles',
    { onRequest: server.auth([secured([Role.ADMIN])]), schema: getRolesSchema },
    getRolesHandler,
  );
  server.get<{ Params: IdParam }>(
    '/user/:id',
    { onRequest: server.auth([secured([Role.ADMIN])]), schema: getUserSchema },
    getUserHandler,
  );
  server.post<{ Body: CreateUserBody }>(
    '/user',
    { onRequest: server.auth([secured([Role.ADMIN])]), schema: createUserSchema },
    createUserHandler,
  );
  server.put<{ Params: IdParam; Body: UpdateUserBody }>(
    '/user/:id',
    { onRequest: server.auth([secured([Role.ADMIN])]), schema: updateUserSchema },
    updateUserHandler,
  );
  server.delete<{ Params: IdParam }>(
    '/user/:id',
    { onRequest: server.auth([secured([Role.ADMIN])]), schema: deleteUserSchema },
    deleteUserHandler,
  );
  server.get('/me', { onRequest: secured(), schema: { hide: true } }, getUserProfileHandler);
};

export default userRoute;
