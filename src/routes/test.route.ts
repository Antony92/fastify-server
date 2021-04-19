import { FastifyPluginAsync, RouteHandlerMethod } from 'fastify'
import { secured } from '../auth/auth.guard'

type RequestAny = { Querystring: any, Params: any, Headers: any, Body: any }

const testRoute: FastifyPluginAsync = async (fastify, options) => {
    fastify.get<RequestAny>('/get/:id', { onRequest: secured(['test']) }, async (request, reply) => {
        console.log(request.query)
        console.log(request.params)
        return { message: 'ok' }
    })
    fastify.post<RequestAny>('/post', { onRequest: secured() }, async (request, reply) => {
        console.log(request.body.username)
        return { message: 'ok' }
    })
}

export default testRoute