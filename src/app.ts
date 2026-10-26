import { simpleJob } from './jobs/simple.job.js';
import server from './server.js';

try {
  server.scheduler.addCronJob(simpleJob);
  await server.listen({ port: server.config.SERVER_PORT, host: '0.0.0.0' });
} catch (error) {
  server.log.error(error);
  process.exit(1);
}
