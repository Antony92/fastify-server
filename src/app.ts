import fastify from 'fastify'
import fastifyCompress from 'fastify-compress'
import fastifyCors from 'fastify-cors'
import fastifyHelmet from 'fastify-helmet'
import fastifyStatic from 'fastify-static'
import fastifyRateLimit from 'fastify-rate-limit'
import fastifyCookie from 'fastify-cookie'
import path from 'path'
import { notFoundHandler } from './handlers/notfound.handler'
import healthRoute from './routes/health.route'
import testRoute from './routes/test.route'

const server = fastify({
	logger: true,
})

server.register(fastifyCompress)
server.register(fastifyCors, { origin: '*', exposedHeaders: ['*'] })
server.register(fastifyHelmet, { contentSecurityPolicy: false })
server.register(fastifyRateLimit, { max: 1000, timeWindow: '15 minutes' })
server.register(fastifyCookie, { secret: 'test' })
server.register(fastifyStatic, { root: path.join(__dirname, 'ui') })
server.setNotFoundHandler(notFoundHandler)

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
