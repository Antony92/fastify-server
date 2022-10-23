import { FastifyInstance } from 'fastify'
import { loginCallbackHandler, loginRefreshHandler, logoutHandler } from '../controllers/login.controller'
import { logoutSchema } from '../schema/login.schema'

const loginRoute = async (fastify: FastifyInstance) => {
	fastify.get('/login/callback', { schema: { hide: true} }, loginCallbackHandler)
	fastify.post('/login/refresh', { schema: { hide: true} }, loginRefreshHandler)
	fastify.get('/logout', { schema: logoutSchema }, logoutHandler)
}

export default loginRoute
