import fastify from 'fastify'
import fastifyCompress from 'fastify-compress'
import fastifyCors from 'fastify-cors'
import fastifyHelmet from 'fastify-helmet'
import fastifyStatic from 'fastify-static'
import path from 'path'
import healthRoute from './routes/health.route'
import testRoute from './routes/test.route'

const server = fastify({
  logger: true
})

server.register(fastifyCompress)
server.register(fastifyCors, { origin: '*', exposedHeaders: ['*'] })
server.register(fastifyHelmet, { contentSecurityPolicy: false })
server.register(fastifyStatic, { root: path.join(__dirname, 'ui') })
server.setNotFoundHandler((request, reply) => {
  if (request.url.includes('/api')) {
    reply.status(404).send({
      message: `Route ${request.method}:${request.url} not found`,
      error: 'Not Found',
      statusCode: 404
    })
  } else {
    reply.sendFile('index.html')
  }
})

// Routes
server.register(healthRoute, { prefix: '/api/v1' })
server.register(testRoute, { prefix: '/api/v1' })

const start = async () => {
  try {
    await server.listen(8080)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
start()
