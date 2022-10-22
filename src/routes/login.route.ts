import { FastifyInstance } from 'fastify'
import { secured } from '../auth/auth.guard'
import { loginHandler, logoutHandler, silentLoginHandler } from '../controllers/login.controller'
import { loginSchema, logoutSchema } from '../schema/login.schema'

const loginRoute = async (fastify: FastifyInstance) => {
	fastify.post('/auth/login', { schema: loginSchema }, loginHandler)
	fastify.get('/auth/logout', { schema: logoutSchema }, logoutHandler)
	fastify.get('/auth/silent', { onRequest: secured() }, silentLoginHandler)
}

export default loginRoute
