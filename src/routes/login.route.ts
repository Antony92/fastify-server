import { FastifyInstance } from 'fastify'
import { loginHandler, logoutHandler, refreshHandler } from '../controllers/login.controller'
import { loginSchema, logoutSchema } from '../schema/login.schema'

const loginRoute = async (server: FastifyInstance) => {
	server.post('/auth/login', { preHandler: server.rateLimit({ max: 5, timeWindow: '1 minute' }), schema: loginSchema }, loginHandler)
	server.post('/auth/logout', { schema: logoutSchema }, logoutHandler)
	server.get('/auth/refresh', { schema: { hide: true } }, refreshHandler)
}

export default loginRoute
