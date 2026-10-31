import crypto from 'node:crypto';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { auditLogs } from '../audit-logs/audit-logs.service.js';
import { createOrUpdateUser, getUserByUsername } from '../user/user.service.js';
import { AuditLogsAction, AuditLogsTarget } from '../audit-logs/audit-logs.type.js';
import { Role } from '../user/user.type.js';

export const loginCallbackHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const token =
    await request.server.microsoftOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

  // TODO get user from oauth2 with token
  const { upn: username, name } = JSON.parse(
    Buffer.from(token.token.access_token.split('.')[1], 'base64').toString(),
  );

  const user = await createOrUpdateUser({
    username,
    name,
    active: true,
    lastLogin: new Date(),
  });

  if (user.blocked) {
    reply.redirect(`${request.server.config.LOGIN_REDIRECT}?error=User is blocked`, 302);
    return reply;
  }

  const now = Date.now();
  const jti = crypto.randomUUID();
  const refreshToken = await reply.refreshJwtSign(
    {
      username,
    },
    {
      jti,
      expiresIn: request.server.config.JWT_REFRESH_TOKEN_EXPIRE,
    },
  );

  request.server.authSession.clearExpiredSessions();
  request.server.authSession.createSession(
    jti,
    username,
    now + request.server.config.COOKIE_REFRESH_EXPIRE,
  );

  reply.cookie(request.server.config.COOKIE_REFRESH_NAME, refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/api/v1/auth',
    expires: new Date(now + request.server.config.COOKIE_REFRESH_EXPIRE),
  });
  reply.redirect(`${request.server.config.LOGIN_REDIRECT}`, 302);
  return reply;
};

export const logoutHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  await request.refreshJwtVerify({ onlyCookie: true });
  const { jti } = request.refreshToken;
  request.server.authSession.clearSession(jti);
  reply.clearCookie(request.server.config.COOKIE_REFRESH_NAME, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/api/v1/auth',
  });
  return { message: 'Logout successful' };
};

export const refreshHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  await request.refreshJwtVerify({ onlyCookie: true });
  const { username } = request.refreshToken;

  const user = await getUserByUsername(username);

  if (!user) {
    throw {
      message: `User does not exist`,
      error: 'Auth',
      statusCode: 404,
    };
  }

  if (user.blocked) {
    throw {
      message: `User is blocked`,
      error: 'Auth',
      statusCode: 403,
    };
  }

  const accessToken = await reply.accessJwtSign(
    {
      id: user.id,
      name: user.name,
      username: user.username,
      roles: user.roles,
      use: 'session',
    },
    { jti: crypto.randomUUID() },
  );

  return { accessToken };
};

export const impersonateHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { username } = request.body as { username: string };
  const user = await getUserByUsername(username);

  if (!user) {
    throw {
      message: `User does not exist`,
      error: 'Auth',
      statusCode: 404,
    };
  }

  if (user.blocked) {
    throw {
      message: `User is blocked`,
      error: 'Auth',
      statusCode: 403,
    };
  }

  if (user.roles.includes(Role.ADMIN)) {
    throw {
      message: `Cannot impersonate admin user`,
      error: 'Auth',
      statusCode: 403,
    };
  }

  const accessToken = await reply.accessJwtSign(
    {
      id: user.id,
      name: user.name,
      username: user.username,
      roles: user.roles,
      impersonated: request.user.username,
      use: 'session',
    },
    { jti: crypto.randomUUID() },
  );

  reply.clearCookie(request.server.config.COOKIE_REFRESH_NAME, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/api/v1/auth',
  });

  await auditLogs(
    request.user,
    AuditLogsAction.UPDATE,
    AuditLogsTarget.USER,
    { user, username },
    `impersonated user ${user.name}`,
  );

  return { accessToken };
};
