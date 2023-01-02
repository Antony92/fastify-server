import { fastify } from 'fastify'
import fastifyCompress from '@fastify/compress'
import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyRateLimit from '@fastify/rate-limit'
import fastifyStatic from '@fastify/static'
import fastifyMultipart from '@fastify/multipart'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastifyJwt from '@fastify/jwt'
import fastifyOauth2 from '@fastify/oauth2'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import config from './config.js'
import swaggerOptions from './swagger.js'
import { AccessToken } from './types/jwt.type.js'
import { trustedAccessTokens, trustedRefreshTokens } from './auth/auth.guard.js'
import healthRoute from './routes/health.route.js'
import authRoute from './routes/auth.route.js'
import serverEventsRoute from './routes/server-events.route.js'
import auditLogRoute from './routes/audit-log.route.js'
import userRoute from './routes/user.route.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
process.env.NODE_ENV = config.environment

// Init fastify server
const server = fastify({
	logger: false,
})

// Plugins
await server.register(fastifyCompress)
await server.register(fastifyCookie)
await server.register(fastifyCors, {
	origin: ['http://localhost:8080', 'http://localhost:5500'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
})
await server.register(fastifyRateLimit as any, { max: config.server.rateLimit, timeWindow: '15 minutes' })
await server.register(fastifyStatic, { root: path.join(__dirname, 'public') })
await server.register(fastifyMultipart, { limits: { fileSize: 2 * 1024 * 1024 } })
await server.register(fastifySwagger, swaggerOptions)
await server.register(fastifySwaggerUi, { routePrefix: '/documentation' })
await server.register(fastifyJwt, {
	namespace: 'access',
	secret: config.jwt.accessTokenSecret,
	sign: {
		iss: config.jwt.issuer,
	},
	verify: {
		allowedIss: config.jwt.issuer,
	},
	formatUser: (token: AccessToken) => token.user,
	trusted: trustedAccessTokens,
})
await server.register(fastifyJwt, {
	namespace: 'refresh',
	decoratorName: 'refreshToken',
	secret: config.jwt.refreshTokenSecret,
	cookie: {
		signed: false,
		cookieName: config.cookies.refreshCookieName,
	},
	sign: {
		iss: config.jwt.issuer,
		expiresIn: config.jwt.refreshTokenExpire
	},
	verify: {
		allowedIss: config.jwt.issuer,
	},
	trusted: trustedRefreshTokens,
})
await server.register(fastifyOauth2, {
	name: 'microsoftOAuth2',
	scope: ['user.read'],
	credentials: {
		client: {
			id: config.microsoft.clientId,
			secret: config.microsoft.clientSecret,
		},
		auth: {
			authorizeHost: 'https://login.microsoftonline.com',
			authorizePath: `/${config.microsoft.tenantId}/oauth2/v2.0/authorize`,
			tokenHost: 'https://login.microsoftonline.com',
			tokenPath: `/${config.microsoft.tenantId}/oauth2/v2.0/token`
		}
	},
	startRedirectPath: '/api/v1/auth/login/microsoft',
	callbackUri: 'http://localhost:8080/api/v1/auth/login/callback',
})

// Not found handler
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
await server.register(healthRoute, { prefix: '/api/v1' })
await server.register(authRoute, { prefix: '/api/v1' })
await server.register(serverEventsRoute, { prefix: '/api/v1' })
await server.register(auditLogRoute, { prefix: '/api/v1' })
await server.register(userRoute, { prefix: '/api/v1' })

// testing
export default server
