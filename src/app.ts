import config from './config'
import server from './server'

const start = async () => {
	try {
		await server.listen(config.server.port, '0.0.0.0')
	} catch (err) {
		server.log.error(err)
		process.exit(1)
	}
}

start()