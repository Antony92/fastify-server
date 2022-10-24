import { FastifyInstance } from 'fastify'
import { loginHandler, logoutHandler } from '../controllers/login.controller'
import { logoutSchema } from '../schema/login.schema'

const loginRoute = async (fastify: FastifyInstance) => {
	fastify.post('/auth/login', { schema: { hide: true} }, loginHandler)
	fastify.get('/auth/logout', { schema: logoutSchema }, logoutHandler)
}

export default loginRoute
