import fastify from 'fastify'
import fastifyCompress from '@fastify/compress'
import fastifyCors from '@fastify/cors'
import fastifyHelmet from '@fastify/helmet'
import fastifyStatic from '@fastify/static'
import fastifyRateLimit from '@fastify/rate-limit'
import fastifyMultipart from '@fastify/multipart'
import fastifyJwt, {
	FastifyJwtSignOptions,
	FastifyJwtVerifyOptions,
	SignOptions,
	SignPayloadType,
	VerifyOptions,
	VerifyPayloadType,
} from '@fastify/jwt'
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
import { OAuth2Namespace } from '@fastify/oauth2'
import { RefreshToken, UserToken } from './models/jwt.model'

process.env.NODE_ENV = config.environment

// Init fastify server
const server = fastify({
	logger: false,
})

// Plugins
server.register(fastifyCompress)
server.register(fastifyJwt, {
	namespace: 'access',
	secret: config.jwt.tokenSecret,
	sign: {
		iss: config.jwt.issuer,
	},
	verify: {
		allowedIss: config.jwt.issuer,
	},
	trusted: trustedApiTokens,
})
server.register(fastifyJwt, {
	namespace: 'refresh',
	decoratorName: 'refreshToken',
	secret: config.jwt.jwtRefreshSecret,
	cookie: {
		signed: false,
		cookieName: config.jwt.jwtRefreshCookieName,
	},
	sign: {
		iss: config.jwt.issuer,
	},
	verify: {
		allowedIss: config.jwt.issuer,
	},
	trusted: trustedApiTokens,
})
server.register(fastifyCookie)
server.register(fastifyCors, {
	origin: ['http://localhost:8080'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
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

// types
declare module '@fastify/jwt' {
	interface FastifyJWT {
		user: UserToken
	}
}

declare module 'fastify' {
	interface FastifyInstance {
		microsoftOAuth: OAuth2Namespace
	}

	interface FastifyRequest {
		accessJwtVerify<Decoded extends VerifyPayloadType>(options?: FastifyJwtVerifyOptions | Partial<VerifyOptions>): Promise<Decoded>
		refreshJwtVerify<Decoded extends VerifyPayloadType>(options?: FastifyJwtVerifyOptions | Partial<VerifyOptions>): Promise<Decoded>
		refreshToken: RefreshToken
	}

	interface FastifyReply {
		accessJwtSign(payload: SignPayloadType, options?: FastifyJwtSignOptions | Partial<SignOptions>): Promise<string>
		refreshJwtSign(payload: SignPayloadType, options?: FastifyJwtSignOptions | Partial<SignOptions>): Promise<string>
	}
}
