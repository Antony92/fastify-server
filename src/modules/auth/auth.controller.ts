import crypto from 'node:crypto';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { auditLogs } from '../audit-logs/audit-logs.service.js';
import { createUser, getUserByUsername } from '../user/user.service.js';
import { AuditLogsAction, AuditLogsTarget } from '../audit-logs/audit-logs.type.js';

export const loginCallbackHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const token =
    await request.server.microsoftOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

  const { upn: username, name } = JSON.parse(
    Buffer.from(token.token.access_token.split('.')[1], 'base64').toString(),
  );

  const user = await createUser({
    username,
    name,
    active: true,
    lastLogin: new Date(),
  });

  if (user.blocked) {
    reply.redirect(`${request.server.config.LOGIN_REDIRECT}?error=User is blocked`, 302);
    return reply;
  }

  const refreshToken = await reply.refreshJwtSign(
    {
      username,
    },
    {
      jti: crypto.randomUUID(),
      expiresIn: request.server.config.JWT_REFRESH_TOKEN_EXPIRE,
    },
  );

  reply.cookie(request.server.config.COOKIE_REFRESH_NAME, refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/api/v1/auth/refresh',
    expires: new Date(Date.now() + request.server.config.COOKIE_REFRESH_EXPIRE),
  });
  reply.redirect(`${request.server.config.LOGIN_REDIRECT}`, 302);
  return reply;
};

export const logoutHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  reply.clearCookie(request.server.config.COOKIE_REFRESH_NAME, { path: '/api/v1/auth/refresh' });
  return { message: 'Logout successful' };
};

export const refreshHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  await request.refreshJwtVerify({ onlyCookie: true });
  const { username } = request.user;

  const dbUser = await getUserByUsername(username);

  if (!dbUser) {
    throw {
      message: `User does not exist`,
      error: 'Auth',
      statusCode: 404,
    };
  }

  if (dbUser.blocked) {
    throw {
      message: `User is blocked`,
      error: 'Auth',
      statusCode: 403,
    };
  }

  const user = {
    id: dbUser.id,
    name: dbUser.name,
    username: dbUser.username,
    roles: dbUser.roles,
  };

  const accessToken = await reply.accessJwtSign(
    {
      ...user,
    },
    {
      jti: crypto.randomUUID(),
    },
  );

  return { ...user, accessToken };
};

export const impersonateHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { username } = request.body as { username: string };
  const dbUser = await getUserByUsername(username);

  if (!dbUser) {
    throw {
      message: `User does not exist`,
      error: 'Auth',
      statusCode: 404,
    };
  }

  if (dbUser.blocked) {
    throw {
      message: `User is blocked`,
      error: 'Auth',
      statusCode: 403,
    };
  }

  const user = {
    id: dbUser.id,
    name: dbUser.name,
    username: dbUser.username,
    roles: dbUser.roles,
  };

  const accessToken = await reply.accessJwtSign(
    {
      ...user,
      impersonated: request.user.username,
    },
    {
      jti: crypto.randomUUID(),
    },
  );

  reply.clearCookie(request.server.config.COOKIE_REFRESH_NAME, { path: '/api/v1/auth/refresh' });

  await auditLogs(
    request.user,
    AuditLogsAction.UPDATE,
    AuditLogsTarget.USER,
    { user, username },
    `impersonated user ${user.name}`,
  );

  return { ...user, accessToken };
};
