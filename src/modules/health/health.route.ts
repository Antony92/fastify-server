import type { FastifyPluginAsync } from 'fastify';
import { checkHealthHandler } from './health.controller.js';

const healthRoute: FastifyPluginAsync = async (server) => {
  server.get('/health', checkHealthHandler);
};

export default healthRoute;
