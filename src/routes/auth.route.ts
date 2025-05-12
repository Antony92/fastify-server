import  { FastifyPluginAsync } from 'fastify'
import { logoutHandler, refreshHandler, loginCallbackHandler, impersonateHandler } from '../controllers/auth.controller.js'
import { secured } from '../auth/auth.guard.js'
import { Role } from '../types/user.type.js'

const authRoute: FastifyPluginAsync = async (server) => {
	server.post('/auth/logout', { schema: { hide: true } }, logoutHandler)
	server.get('/auth/refresh', { schema: { hide: true } }, refreshHandler)
	server.get('/auth/login/callback', { schema: { hide: true } }, loginCallbackHandler)
	server.post('/auth/impersonate', { onRequest: secured([Role.ADMIN]), schema: { hide: true } }, impersonateHandler)
}

export default authRoute
