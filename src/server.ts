import fastify from 'fastify'
import fastifyCompress from 'fastify-compress'
import fastifyCors from 'fastify-cors'
import fastifyHelmet from 'fastify-helmet'
import fastifyStatic from 'fastify-static'
import fastifyRateLimit from 'fastify-rate-limit'
import fastifyCookie from 'fastify-cookie'
import path from 'path'
import fs from 'fs'
import healthRoute from './routes/health.route'
import testRoute from './routes/test.route'
import config from './config'

process.env.NODE_ENV = config.environment

const certKeyPath = path.resolve(__dirname, 'pk/ssl.key')
const certPath = path.resolve(__dirname, 'pk/ssl.cer')

const options = {
	http2: config.environment === 'production' ? true : false,
	https: config.environment === 'production' ? {
		allowHTTP1: false,
		key: fs.existsSync(certKeyPath) ? fs.readFileSync(certKeyPath, 'utf8') : null,
		cert: fs.existsSync(certPath) ? fs.readFileSync(certPath, 'utf8') : null,
	} : null,
	logger: false,
}

// Init fastify server with config
const server = fastify(options)

// Plugins
server.register(fastifyCompress)
server.register(fastifyCors, { origin: '*', exposedHeaders: ['*'] })
server.register(fastifyHelmet, { contentSecurityPolicy: false })
server.register(fastifyRateLimit, { max: config.server.rateLimit, timeWindow: '15 minutes' })
server.register(fastifyCookie, { secret: 'test' })
server.register(fastifyStatic, { root: path.join(__dirname, 'public') })
server.setNotFoundHandler((request, reply) => {
	if (request.url.includes('/api')) {
		reply.status(404).send({
			message: `Route ${request.method}:${request.url} not found`,
			error: 'Not Found',
			statusCode: 404,
		})
	} else {
		reply.sendFile('index.html')
	}
})

// Routes
server.register(healthRoute, { prefix: '/api/v1' })
server.register(testRoute, { prefix: '/api/v1' })

// testing
export default server
