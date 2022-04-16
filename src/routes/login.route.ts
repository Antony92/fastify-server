import { FastifyInstance } from 'fastify'
import { loginHandler, logoutHandler } from '../controllers/login.controller'
import { loginSchema } from '../schema/login.schema'

const loginRoute = async (fastify: FastifyInstance) => {
    fastify.post('/auth/login', { schema: loginSchema }, loginHandler)
    fastify.get('/auth/logout', logoutHandler)
}

export default loginRoute
