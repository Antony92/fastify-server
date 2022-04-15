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
import { trustedApiTokens } from './auth/auth.guard'
import log from './logger'

process.env.NODE_ENV = config.environment

const isProduction = config.environment === 'production'

const serverOptions = {
	http2: isProduction,
	https: isProduction ? {
		allowHTTP1: true,
		key: fs.readFileSync(path.resolve(__dirname, 'pk/ssl.key'), 'utf8'),
		cert: fs.readFileSync(path.resolve(__dirname, 'pk/ssl.cer'), 'utf8'),
	} : null,
	logger: log
}

// Init fastify server with config
const server = fastify(serverOptions)

// Plugins
server.register(fastifyCompress)
server.register(fastifyJwt, {
	secret: config.jwt.secret,
	sign: {
		iss: config.jwt.issuer,
		aud: config.jwt.audience,
		expiresIn: config.jwt.expire,
	},
	verify: {
		allowedIss: config.jwt.issuer,
		extractToken: (request) => request.headers['authorization']?.toString().split(' ')[1] || request.headers['x-api-key']?.toString(),
	},
	trusted: trustedApiTokens,
})
server.register(fastifyCors, { origin: isProduction, exposedHeaders: ['*'] })
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
