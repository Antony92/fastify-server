import { FastifyRequest, FastifyReply } from 'fastify'
import crypto from 'crypto'
import config from '../config.js'
import { createUser, getUserByUsername } from '../services/user.service.js'
import { auditLog } from '../services/audit-log.service.js'
import { AuditLogAction, AuditLogTarget } from '../types/audit-log.type.js'

export const loginCallbackHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	const token = await request.server.microsoftOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)

	const { upn: username, name } = JSON.parse(Buffer.from(token.token.access_token.split('.')[1], 'base64').toString())

	const user = await createUser({
		username,
		name,
		active: true,
		lastLogin: new Date()
	})

	if (user.blocked) {
		reply.redirect(`${config.auth.loginPageURL}?error=User is blocked`, 302)
		return reply
	}

	const accessToken = await reply.accessJwtSign(
		{
			user: {
				id: user.id,
				name: user.name,
				username: user.username,
				roles: user.roles,
			},
		},
		{
			jti: crypto.randomUUID(),
		}
	)

	const refreshToken = await reply.refreshJwtSign(
		{
			username,
		},
		{
			jti: crypto.randomUUID(),
		}
	)
	
	reply.cookie(config.cookies.refreshCookieName, refreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		path: '/api/v1/auth/refresh',
		expires: new Date(Date.now() + config.cookies.refreshCookieExpire),
	})
	reply.redirect(`${config.auth.loginPageURL}?token=${accessToken}`, 302)
	return reply
}

export const logoutHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	reply.clearCookie(config.cookies.refreshCookieName, { path: '/api/v1/auth/refresh' })
	return { message: 'Logout successful' }
}

export const refreshHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	await request.refreshJwtVerify({ onlyCookie: true })
	const { username } = request.refreshToken
	const user = await getUserByUsername(username)
	
	if (!user) {
		throw {
			message: `User does not exist`,
			error: 'Auth',
			statusCode: 404,
		}
	}

	if (user.blocked) {
		throw {
			message: `User is blocked`,
			error: 'Auth',
			statusCode: 403,
		}
	}

	const accessToken = await reply.accessJwtSign(
		{
			user: {
				id: user.id,
				name: user.name,
				username: user.username,
				roles: user.roles,
			},
		},
		{
			jti: crypto.randomUUID(),
		}
	)
	
	return { accessToken }
}

export const impersonateHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	const { username } = request.body as { username: string }
	const user = await getUserByUsername(username)
	
	if (!user) {
		throw {
			message: `User does not exist`,
			error: 'Auth',
			statusCode: 404,
		}
	}

	if (user.blocked) {
		throw {
			message: `User is blocked`,
			error: 'Auth',
			statusCode: 403,
		}
	}

	const accessToken = await reply.accessJwtSign(
		{
			user: {
				id: user.id,
				name: user.name,
				username: user.username,
				roles: user.roles,
				impersonated: `${request.user.name} - ${request.user.username}`
			},
		},
		{
			jti: crypto.randomUUID(),
		}
	)

	reply.clearCookie(config.cookies.refreshCookieName, { path: '/api/v1/auth/refresh' })

	await auditLog(request.user, AuditLogAction.UPDATE, AuditLogTarget.USER, { user, username }, `impersonated user ${user.name}`)
	
	return { accessToken }
}
