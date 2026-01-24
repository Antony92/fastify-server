import config from './config.js'
import { simpleJob } from './jobs/simple.job.js'
import server from './server.js'

try {
  server.scheduler.addCronJob(simpleJob)
	await server.listen({ port: config.server.port })
} catch (err) {
	server.log.error(err)
	process.exit(1)
}
