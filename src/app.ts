import { simpleJob } from './jobs/simple.job.js';
import server from './server.js';
import { initializeSQLite } from './sqlite/index.js';

try {
  initializeSQLite();
  server.scheduler.addCronJob(simpleJob);
  await server.listen({ port: server.config.SERVER_PORT, host: server.config.SERVER_HOST });
} catch (error) {
  server.log.error(error);
  process.exit(1);
}
