import fastify from 'fastify'
import fastifyCompress from 'fastify-compress'
import fastifyCors from 'fastify-cors'
import fastifyHelmet from 'fastify-helmet'
import fastifyStatic from 'fastify-static'
import fastifyRateLimit from 'fastify-rate-limit'
import fastifyMultipart from 'fastify-multipart'
import fastifyJwt from 'fastify-jwt'
import fastifyCookie from 'fastify-cookie'
import fastifySwagger from 'fastify-swagger'
import path from 'path'
import fs from 'fs'
import config from './config'
import { getToken, trustedApiTokens } from './auth/auth.guard'
import log from './utils/logger'
import { swaggerOptions } from './swagger'
import healthRoute from './routes/health.route'
import testRoute from './routes/test.route'
import loginRoute from './routes/login.route'

process.env.NODE_ENV = config.environment

const isProduction = config.environment === 'production'

const serverOptions = {
	http2: isProduction,
	https: isProduction ? {
		allowHTTP1: true,
		key: fs.readFileSync(path.resolve(__dirname, 'pk/ssl.key'), 'utf8'),
		cert: fs.readFileSync(path.resolve(__dirname, 'pk/ssl.cer'), 'utf8'),
	} : null,
	logger: log,
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
		extractToken: getToken,
	},
	trusted: trustedApiTokens,
})
server.register(fastifyCookie, { secret: config.cookie.secret })
server.register(fastifyCors, { origin: ['http://localhost:8080'], allowedHeaders: ['Content-Type', 'Authorization'] })
server.register(fastifyHelmet, { contentSecurityPolicy: false })
server.register(fastifyRateLimit, { max: config.server.rateLimit, timeWindow: '15 minutes' })
server.register(fastifyStatic, { root: path.join(__dirname, 'public') })
server.register(fastifyMultipart)
server.register(fastifySwagger, swaggerOptions)
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
server.register(loginRoute, { prefix: '/api/v1'})

// testing
export default server
