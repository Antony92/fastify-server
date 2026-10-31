import crypto from 'node:crypto';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { createApiKey, deleteApiKeyByUserId } from './api-key.service.js';
import { auditLogs } from '../audit-logs/audit-logs.service.js';
import { AuditLogsAction, AuditLogsTarget } from '../audit-logs/audit-logs.type.js';
import type { IdParam } from '../../types/request.type.js';
import { getUserById } from '../user/user.service.js';

export const createUserApiKeyHandler = async (
  request: FastifyRequest<{ Params: IdParam }>,
  reply: FastifyReply,
) => {
  const { id } = request.params;
  const user = await getUserById(id);
  const jti = crypto.randomUUID();
  const jwt = await reply.accessJwtSign(
    {
      id: user.id,
      name: user.name,
      username: user.username,
      roles: user.roles,
      use: 'api',
    },
    {
      jti,
      expiresIn: '360d',
    },
  );
  await createApiKey({
    jti,
    userId: user.id,
  });
  await auditLogs(
    request.user,
    AuditLogsAction.CREATE,
    AuditLogsTarget.USER,
    { user, jti },
    'create user api key',
  );
  return { message: 'API key created', data: jwt };
};

export const deleteUserApiKeyHandler = async (request: FastifyRequest<{ Params: IdParam }>) => {
  const { id } = request.params;
  const apiKey = await deleteApiKeyByUserId(id);
  await auditLogs(
    request.user,
    AuditLogsAction.DELETE,
    AuditLogsTarget.USER,
    { apiKey },
    'delete user api key',
  );
  return { message: 'API key deleted', data: apiKey.id };
};

export const createPersonalApiKeyHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const jti = crypto.randomUUID();
  const jwt = await reply.accessJwtSign(
    {
      id: request.user.id,
      name: request.user.name,
      username: request.user.username,
      roles: request.user.roles,
      use: 'api',
    },
    {
      jti,
      expiresIn: '360d',
    },
  );
  await createApiKey({
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
  return { message: 'API key created', data: jwt };
};

export const deletePersonalApiKeyHandler = async (request: FastifyRequest) => {
  const apiKey = await deleteApiKeyByUserId(request.user.id);
  await auditLogs(
    request.user,
    AuditLogsAction.DELETE,
    AuditLogsTarget.USER,
    { apiKey },
    'delete personal api key',
  );
  return { message: 'API key deleted', data: apiKey.id };
};
