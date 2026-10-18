import type { FastifyPluginAsync } from 'fastify';
import { secured } from '../auth/auth.guard.js';
import { submitFeedbackHandler } from './feedback.controller.js';
import { submitFeedbackSchema } from './feedback.schema.js';
import type { CreateFeedbackBody } from './feedback.type.js';

const feedbackRoute: FastifyPluginAsync = async (server) => {
  server.post<{ Body: CreateFeedbackBody }>(
    '/feedback',
    { onRequest: secured(), schema: submitFeedbackSchema },
    submitFeedbackHandler,
  );
};

export default feedbackRoute;
