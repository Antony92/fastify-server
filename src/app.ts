import config from './config'
import server from './server'

const start = async () => {
	try {
		await server.listen(config.server.port)
	} catch (err) {
		server.log.error(err)
		process.exit(1)
	}
}

start()