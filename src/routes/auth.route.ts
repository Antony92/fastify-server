import { FastifyPluginAsync } from 'fastify'
import { logoutHandler, refreshHandler, loginCallbackHandler } from '../controllers/auth.controller.js'

const authRoute: FastifyPluginAsync = async (server) => {
	server.post('/auth/logout', { schema: { hide: true } }, logoutHandler)
	server.get('/auth/refresh', { schema: { hide: true } }, refreshHandler)
	server.get('/auth/login/callback', { schema: { hide: true } }, loginCallbackHandler)
}

export default authRoute
