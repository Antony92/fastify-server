import crypto from 'node:crypto';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { createApiKey, deleteApiKeyByUserId } from '../api-keys/api-key.service.js';
import { auditLogs } from '../audit-logs/audit-logs.service.js';
import {
  createUser,
  deleteUser,
  getRoles,
  getUserById,
  getUserProfile,
  getUsers,
  updateUser,
} from './user.service.js';
import { AuditLogsAction, AuditLogsTarget } from '../audit-logs/audit-logs.type.js';
import type { IdParam } from '../../types/request.type.js';
import type { CreateUserBody, UpdateUserBody, UserSearchQuery } from './user.type.js';

export const getRolesHandler = async () => {
  const roles = getRoles();
  return { data: roles };
};

export const getUserHandler = async (request: FastifyRequest<{ Params: IdParam }>) => {
  const { id } = request.params;
  const user = await getUserById(id);
  return { data: user };
};

export const getUsersHandler = async (
  request: FastifyRequest<{ Querystring: UserSearchQuery }>,
) => {
  const { users, total } = await getUsers(request.query);
  return { data: users, total };
};

export const createUserHandler = async (request: FastifyRequest<{ Body: CreateUserBody }>) => {
  const body = request.body;
  const user = await createUser({ ...body, internal: true });
  await auditLogs(request.user, AuditLogsAction.CREATE, AuditLogsTarget.USER, user, 'create user');
  return { message: 'User created', data: user };
};

export const updateUserHandler = async (
  request: FastifyRequest<{ Params: IdParam; Body: UpdateUserBody }>,
) => {
  const { id } = request.params;
  const body = request.body;
  const user = await updateUser({ id, ...body });
  await auditLogs(request.user, AuditLogsAction.UPDATE, AuditLogsTarget.USER, user, 'update user');
  return { message: 'User updated', data: user };
};

export const deleteUserHandler = async (request: FastifyRequest<{ Params: IdParam }>) => {
  const { id } = request.params;
  const user = await deleteUser(id);
  await auditLogs(request.user, AuditLogsAction.DELETE, AuditLogsTarget.USER, user, 'delete user');
  return { message: 'User deleted', data: user };
};

export const getUserProfileHandler = async (request: FastifyRequest) => {
  const profile = await getUserProfile(request.user.id);
  return { data: profile };
};

export const createUserApiKeyHandler = async (
  request: FastifyRequest<{ Params: IdParam }>,
  reply: FastifyReply,
) => {
  const { id } = request.params;
  const user = await getUserById(id);
  const jti = crypto.randomUUID();
  const jwt = await reply.jwtSign(
    {
      id: user.id,
      name: user.name,
      username: user.username,
      roles: user.roles,
    },
    {
      jti,
      expiresIn: '360d',
    },
  );
  const apiKey = await createApiKey({
    jwt,
    jti,
    userId: user.id,
  });
  await auditLogs(
    request.user,
    AuditLogsAction.CREATE,
    AuditLogsTarget.USER,
    { user, jti: apiKey.jti },
    'create user api key',
  );
  return { message: 'API key created', data: apiKey };
};

export const deleteUserApiKeyHandler = async (request: FastifyRequest<{ Params: IdParam }>) => {
  const { id } = request.params;
  const apiKey = await deleteApiKeyByUserId(id);
  await auditLogs(
    request.user,
    AuditLogsAction.DELETE,
    AuditLogsTarget.USER,
    { jti: apiKey.jti },
    'delete user api key',
  );
  return { message: 'API key deleted', data: apiKey.id };
};

export const createPersonalApiKeyHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const jti = crypto.randomUUID();
  const jwt = await reply.jwtSign(
    {
      ...request.user,
    },
    {
      jti,
      expiresIn: '360d',
    },
  );
  const apiKey = await createApiKey({
    jwt,
    jti,
    userId: request.user.id,
  });
  await auditLogs(
    request.user,
    AuditLogsAction.CREATE,
    AuditLogsTarget.USER,
    { jti },
    'create personal api key',
  );
  return { message: 'API key created', data: apiKey };
};

export const deletePersonalApiKeyHandler = async (request: FastifyRequest) => {
  const apiKey = await deleteApiKeyByUserId(request.user.id);
  await auditLogs(
    request.user,
    AuditLogsAction.DELETE,
    AuditLogsTarget.USER,
    { jti: apiKey.jti },
    'delete personal api key',
  );
  return { message: 'API key deleted', data: apiKey.id };
};
