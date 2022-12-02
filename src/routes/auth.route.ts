import { FastifyInstance } from 'fastify'
import { loginHandler, logoutHandler, refreshHandler } from '../controllers/auth.controller.js'
import { loginSchema, logoutSchema } from '../schema/auth.schema.js'

const authRoute = async (server: FastifyInstance) => {
	server.post('/auth/login', { schema: loginSchema }, loginHandler)
	server.post('/auth/logout', { schema: logoutSchema }, logoutHandler)
	server.get('/auth/refresh', { schema: { hide: true } }, refreshHandler)
}

export default authRoute
