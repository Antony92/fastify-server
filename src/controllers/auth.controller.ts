import crypto from 'node:crypto';
import type { FastifyReply, FastifyRequest } from 'fastify';
import config from '../config.js';
import { auditLog } from '../services/audit-log.service.js';
import { createUser, getUserByUsername } from '../services/user.service.js';
import { AuditLogAction, AuditLogTarget } from '../types/audit-log.type.js';

export const loginCallbackHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	const token = await request.server.microsoftOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

	const { upn: username, name } = JSON.parse(Buffer.from(token.token.access_token.split('.')[1], 'base64').toString());

	const user = await createUser({
		username,
		name,
		active: true,
		lastLogin: new Date(),
	});

	if (user.blocked) {
		reply.redirect(`${config.auth.loginRedirect}?error=User is blocked`, 302);
		return reply;
	}

	const refreshToken = await reply.refreshJwtSign(
		{
			username,
		},
		{
			jti: crypto.randomUUID(),
		},
	);

	reply.cookie(config.cookies.refreshCookieName, refreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		path: '/api/v1/auth/refresh',
		expires: new Date(Date.now() + config.cookies.refreshCookieExpire),
	});
	reply.redirect(`${config.auth.loginRedirect}`, 302);
	return reply;
};

export const logoutHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	reply.clearCookie(config.cookies.refreshCookieName, { path: '/api/v1/auth/refresh' });
	return { message: 'Logout successful' };
};

export const refreshHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	await request.refreshJwtVerify({ onlyCookie: true });
	const { username } = request.refreshToken;
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
  }

	const accessToken = await reply.accessJwtSign(
		{
			user
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
		impersonated: `${request.user.name} - ${request.user.username}`
  }

	const accessToken = await reply.accessJwtSign(
		{
			user,
		},
		{
			jti: crypto.randomUUID(),
		},
	);

	reply.clearCookie(config.cookies.refreshCookieName, { path: '/api/v1/auth/refresh' });

	await auditLog(request.user, AuditLogAction.UPDATE, AuditLogTarget.USER, { user, username }, `impersonated user ${user.name}`);

	return { ...user, accessToken };
};
