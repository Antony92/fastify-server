import { FastifyInstance } from 'fastify'
import { loginHandler, logoutHandler, refreshHandler } from '../controllers/login.controller'
import { loginSchema, logoutSchema } from '../schema/login.schema'

const loginRoute = async (fastify: FastifyInstance) => {
	fastify.post('/auth/login', { schema: loginSchema }, loginHandler)
	fastify.post('/auth/logout', { schema: logoutSchema }, logoutHandler)
	fastify.get('/auth/refresh', { schema: { hide: true } }, refreshHandler)
}

export default loginRoute
