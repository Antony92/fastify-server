import Fastify, { FastifyInstance } from 'fastify'
import fastifyCompress from 'fastify-compress'
import fastifyCors from 'fastify-cors'
import fastifyHelmet from 'fastify-helmet'
import fastifyStatic from 'fastify-static'
import path from 'path'
import healthRoute from './routes/health.route'
import testRoute from './routes/test.route'

const server: FastifyInstance = Fastify({
    logger: true
})

server.register(fastifyCompress)
server.register(fastifyCors, { origin: '*', exposedHeaders: ['*'] })
server.register(fastifyHelmet, { contentSecurityPolicy: false })
server.register(fastifyStatic, { root: path.join(__dirname, 'ui') })

// Routes
server.register(healthRoute, { prefix: '/api/v1' })
server.register(testRoute, { prefix: '/api/v1' })

const start = async () => {
  try {
    await server.listen(3000)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
start()
