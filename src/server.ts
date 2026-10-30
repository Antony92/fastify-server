import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import fastifyAuth from '@fastify/auth';
import fastifyEnv from '@fastify/env';
import fastifyCompress from '@fastify/compress';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifyMultipart from '@fastify/multipart';
import fastifyOauth2 from '@fastify/oauth2';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifySchedule from '@fastify/schedule';
import fastifySSE from '@fastify/sse';
import fastifyStatic from '@fastify/static';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyWebsocket from '@fastify/websocket';
import fastify, { LogController } from 'fastify';
import { trustedAccessTokens, trustedRefreshTokens } from './modules/auth/auth.guard.js';
import auditLogRoute from './modules/audit-logs/audit-logs.route.js';
import authRoute from './modules/auth/auth.route.js';
import feedbackRoute from './modules/feedback/feedback.route.js';
import healthRoute from './modules/health/health.route.js';
import serverEventsRoute from './modules/server-events/server-events.route.js';
import userRoute from './modules/user/user.route.js';
import apiKeyRoute from './modules/api-key/api-key.route.js';
import websocketRoute from './modules/websocket/websocket.route.js';
import swaggerOptions from './swagger.js';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { configSchema } from './config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// init fastify server
const server = fastify({
  logger: true,
  logController: new LogController({ disableRequestLogging: true }),
}).withTypeProvider<TypeBoxTypeProvider>();

// plugins
await server.register(fastifyEnv, { schema: configSchema });
await server.register(fastifyCompress);
await server.register(fastifyCookie);
await server.register(fastifyCors, {
  origin: ['http://localhost:8080', 'http://localhost:5173'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});
await server.register(fastifyRateLimit, {
  max: server.config.SERVER_RATE_LIMIT,
  timeWindow: '15 minutes',
});
await server.register(fastifyStatic, { root: path.join(__dirname, 'public') });
await server.register(fastifyMultipart, {
  limits: { fileSize: 5 * 1024 * 1024 },
  attachFieldsToBody: 'keyValues',
}); // max file size is set to 5MB
await server.register(fastifySwagger, swaggerOptions);
await server.register(fastifySwaggerUi, { routePrefix: '/swagger' });
await server.register(fastifyWebsocket);
await server.register(fastifySSE.default);
await server.register(fastifySchedule);
await server.register(fastifyAuth);
await server.register(fastifyJwt, {
  namespace: 'access',
  secret: server.config.JWT_ACCESS_TOKEN_SECRET,
  sign: {
    algorithm: 'HS256',
    header: { alg: 'HS256', typ: 'at+jwt' },
    iss: server.config.JWT_ISSUER,
    aud: `${server.config.JWT_AUDIENCE}:access`,
    expiresIn: server.config.JWT_ACCESS_TOKEN_EXPIRE,
  },
  verify: {
    algorithms: ['HS256'],
    checkTyp: 'at+jwt',
    allowedIss: server.config.JWT_ISSUER,
    allowedAud: `${server.config.JWT_AUDIENCE}:access`,
    requiredClaims: ['iss', 'aud', 'exp'],
  },
  trusted: trustedAccessTokens,
});
await server.register(fastifyJwt, {
  namespace: 'refresh',
  decoratorName: 'refreshToken',
  secret: server.config.JWT_REFRESH_TOKEN_SECRET,
  cookie: {
    signed: false,
    cookieName: server.config.COOKIE_REFRESH_NAME,
  },
  sign: {
    algorithm: 'HS256',
    header: { alg: 'HS256', typ: 'rt+jwt' },
    iss: server.config.JWT_ISSUER,
    aud: `${server.config.JWT_AUDIENCE}:refresh`,
    expiresIn: server.config.JWT_REFRESH_TOKEN_EXPIRE,
  },
  verify: {
    algorithms: ['HS256'],
    checkTyp: 'rt+jwt',
    allowedIss: server.config.JWT_ISSUER,
    allowedAud: `${server.config.JWT_AUDIENCE}:refresh`,
    requiredClaims: ['iss', 'aud', 'exp'],
  },
  trusted: trustedRefreshTokens,
});
await server.register(fastifyOauth2, {
  name: 'microsoftOAuth2',
  scope: ['user.read'],
  credentials: {
    client: {
      id: server.config.MICROSOFT_CLIENT_ID,
      secret: server.config.MICROSOFT_CLIENT_SECRET,
    },
    auth: {
      authorizeHost: 'https://login.microsoftonline.com',
      authorizePath: `/${server.config.MICROSOFT_TENANT_ID}/oauth2/v2.0/authorize`,
      tokenHost: 'https://login.microsoftonline.com',
      tokenPath: `/${server.config.MICROSOFT_TENANT_ID}/oauth2/v2.0/token`,
    },
  },
  startRedirectPath: '/api/v1/auth/login/microsoft',
  callbackUri: server.config.LOGIN_CALLBACK_URL,
});

// not found handler
server.setNotFoundHandler((request, reply) => {
  if (request.url.includes('/api')) {
    reply.code(404).send({
      message: `Route ${request.method}:${request.url} not found`,
      error: 'Not Found',
      statusCode: 404,
    });
  } else {
    reply.sendFile('index.html');
  }
});

// routes
await server.register(healthRoute, { prefix: '/api/v1' });
await server.register(authRoute, { prefix: '/api/v1' });
await server.register(serverEventsRoute, { prefix: '/api/v1' });
await server.register(auditLogRoute, { prefix: '/api/v1' });
await server.register(userRoute, { prefix: '/api/v1' });
await server.register(apiKeyRoute, { prefix: '/api/v1' });
await server.register(websocketRoute, { prefix: '/api/v1' });
await server.register(feedbackRoute, { prefix: '/api/v1' });

// testing
export default server;
