import { fastify } from 'fastify'
import './helpers/fastify.helper.js'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import config from './config.js'
import swaggerOptions from './swagger.js'
import { AccessToken } from './types/jwt.type.js'
import { trustedAccessTokens, trustedRefreshTokens } from './auth/auth.guard.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
process.env.NODE_ENV = config.environment

// Init fastify server
const server = fastify({
	logger: false,
})

// Plugins
await server.register(import('@fastify/jwt'), {
	namespace: 'access',
	secret: config.jwt.accessTokenSecret,
	cookie: {
		signed: false,
		cookieName: config.cookies.accessCookieName,
	},
	sign: {
		iss: config.jwt.issuer,
	},
	verify: {
		allowedIss: config.jwt.issuer,
	},
	formatUser: (token: AccessToken) => token.user,
	trusted: trustedAccessTokens,
})
await server.register(import('@fastify/jwt'), {
	namespace: 'refresh',
	decoratorName: 'refreshToken',
	secret: config.jwt.refreshTokenSecret || 'test',
	cookie: {
		signed: false,
		cookieName: config.cookies.refreshCookieName,
	},
	sign: {
		iss: config.jwt.issuer,
	},
	verify: {
		allowedIss: config.jwt.issuer,
	},
	trusted: trustedRefreshTokens,
})
await server.register(import('@fastify/compress'))
await server.register(import('@fastify/cookie'))
await server.register(import('@fastify/cors'), {
	origin: ['http://localhost:8080', 'http://localhost:5500'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
})
await server.register(import('@fastify/rate-limit') as any, { max: config.server.rateLimit, timeWindow: '15 minutes' })
await server.register(import('@fastify/static'), { root: path.join(__dirname, 'public') })
await server.register(import('@fastify/multipart'), { limits: { fileSize: 2 * 1024 * 1024 } })
await server.register(import('@fastify/swagger'), swaggerOptions)
await server.register(import('@fastify/swagger-ui'), { routePrefix: '/documentation' })
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
await server.register(import('./routes/health.route.js'), { prefix: '/api/v1' })
await server.register(import('./routes/server-events.route.js'), { prefix: '/api/v1' })
await server.register(import('./routes/test.route.js'), { prefix: '/api/v1' })
await server.register(import('./routes/auth.route.js'), { prefix: '/api/v1' })

// testing
export default server
