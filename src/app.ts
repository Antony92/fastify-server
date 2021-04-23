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
import { notFoundHandler } from './handlers/notfound.handler'

process.env.NODE_ENV = config.environment

const privateKeyPath = `${__dirname}/pk/ssl.key`
const publicKeyPath = `${__dirname}/pk/ssl.cer`

// Https config
const httpsConfig = {
	http2: true,
	https: {
		key: fs.existsSync(privateKeyPath) ? fs.readFileSync(privateKeyPath, 'utf8') : null,
    	cert: fs.existsSync(publicKeyPath) ? fs.readFileSync(publicKeyPath, 'utf8') : null
	}
}

// Init fastify server with config
const server = fastify({
	...config.server.https ? httpsConfig : null,
	logger: true,
})

// Plugins
server.register(fastifyCompress)
server.register(fastifyCors, { origin: '*', exposedHeaders: ['*'] })
server.register(fastifyHelmet, { contentSecurityPolicy: false })
server.register(fastifyRateLimit, { max: config.server.rateLimit, timeWindow: '15 minutes' })
server.register(fastifyCookie, { secret: 'test' })
server.register(fastifyStatic, { root: path.join(__dirname, 'public') })
server.setNotFoundHandler(notFoundHandler)

// Routes
server.register(healthRoute, { prefix: '/api/v1' })
server.register(testRoute, { prefix: '/api/v1' })

// Start server
const start = async () => {
	try {
		await server.listen(config.server.port)
	} catch (err) {
		server.log.error(err)
		process.exit(1)
	}
}
start()
