import config from './config.js'
import server from './server.js'

try {
	await server.listen({ port: config.server.port })
} catch (err) {
	server.log.error(err)
	process.exit(1)
}

