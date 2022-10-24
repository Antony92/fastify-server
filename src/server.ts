import fastify from 'fastify'
import fastifyCompress from '@fastify/compress'
import fastifyCors from '@fastify/cors'
import fastifyHelmet from '@fastify/helmet'
import fastifyStatic from '@fastify/static'
import fastifyRateLimit from '@fastify/rate-limit'
import fastifyMultipart from '@fastify/multipart'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import path from 'path'
import config from './config'
import { trustedApiTokens } from './auth/auth.guard'
import swaggerOptions from './swagger'
import healthRoute from './routes/health.route'
import testRoute from './routes/test.route'
import loginRoute from './routes/login.route'

process.env.NODE_ENV = config.environment

// Init fastify server
const server = fastify({
	logger: false,
})

// Plugins
server.register(fastifyCompress)
server.register(fastifyJwt, {
	secret: config.jwt.secret,
	cookie: {
		cookieName: config.cookie.name,
		signed: false,
	},
	sign: {
		iss: config.jwt.issuer
	},
	verify: {
		allowedIss: config.jwt.issuer,
	},
	trusted: trustedApiTokens,
})
server.register(fastifyCookie, { secret: config.cookie.secret })
server.register(fastifyCors, {
	origin: ['http://localhost:8080'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
})
server.register(fastifyHelmet, { contentSecurityPolicy: false })
server.register(fastifyRateLimit, { max: config.server.rateLimit, timeWindow: '15 minutes' })
server.register(fastifyStatic, { root: path.join(__dirname, 'public') })
server.register(fastifyMultipart, { limits: { fileSize: 2 * 1024 * 1024 } })
server.register(fastifySwagger, swaggerOptions)
server.register(fastifySwaggerUi, { routePrefix: '/documentation' })
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
server.register(loginRoute, { prefix: '/api/v1' })

// testing
export default server
