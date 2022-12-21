import { FastifyInstance } from 'fastify'
import { loginHandler, logoutHandler, refreshHandler, loginCallbackHandler } from '../controllers/auth.controller.js'
import { loginSchema } from '../schema/auth.schema.js'

const authRoute = async (server: FastifyInstance) => {
	server.post('/auth/login', { schema: loginSchema }, loginHandler)
	server.post('/auth/logout', { schema: { hide: true } }, logoutHandler)
	server.get('/auth/refresh', { schema: { hide: true } }, refreshHandler)
	server.post('/auth/login/callback', { schema: { hide: true } }, loginCallbackHandler)
}

export default authRoute
