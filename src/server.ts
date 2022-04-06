import fastify from 'fastify'
import fastifyCompress from 'fastify-compress'
import fastifyCors from 'fastify-cors'
import fastifyHelmet from 'fastify-helmet'
import fastifyStatic from 'fastify-static'
import fastifyRateLimit from 'fastify-rate-limit'
import fastifyJwt from 'fastify-jwt'
import path from 'path'
import fs from 'fs'
import healthRoute from './routes/health.route'
import testRoute from './routes/test.route'
import config from './config'

process.env.NODE_ENV = config.environment

const production = config.environment === 'production'

const options = {
	http2: production,
	https: production ? {
		allowHTTP1: true,
		key: fs.readFileSync(path.resolve(__dirname, 'pk/ssl.key'), 'utf8'),
		cert: fs.readFileSync(path.resolve(__dirname, 'pk/ssl.cer'), 'utf8'),
	} : null,
	logger: true,
}

// Init fastify server with config
const server = fastify(options)

// Plugins
server.register(fastifyCompress)
server.register(fastifyJwt, {
	secret: config.jwt.secret,
	sign: {
		iss: config.jwt.issuer,
		aud: config.jwt.audience,
		expiresIn: config.jwt.expire
	}
})
server.register(fastifyCors, { origin: '*', exposedHeaders: ['*'] })
server.register(fastifyHelmet, { contentSecurityPolicy: false })
server.register(fastifyRateLimit, { max: config.server.rateLimit, timeWindow: '15 minutes' })
server.register(fastifyStatic, { root: path.join(__dirname, 'public') })
server.setNotFoundHandler((request, reply) => {
	if (request.url.includes('/api')) {
		reply.code(404).send({
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
