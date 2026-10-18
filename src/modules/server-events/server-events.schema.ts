import type { FastifySchema } from 'fastify';
import { idParamSchema, paginationQuerySchema } from '../../types/request.type.js';
import { createServerEventBodySchema, updateServerEventBodySchema } from './server-events.type.js';

export const getServerEventsSchema: FastifySchema = {
  tags: ['Server event'],
  description: 'Get server events',
  consumes: ['application/json'],
  produces: ['application/json'],
  security: [
    {
      bearerAuth: [],
    },
  ],
  querystring: paginationQuerySchema,
};

export const createServerEventSchema: FastifySchema = {
  tags: ['Server event'],
  description: 'Create server event',
  consumes: ['application/json'],
  produces: ['application/json'],
  security: [
    {
      bearerAuth: [],
    },
  ],
  body: createServerEventBodySchema,
};

export const updateServerEventSchema: FastifySchema = {
  tags: ['Server event'],
  description: 'Update server event',
  consumes: ['application/json'],
  produces: ['application/json'],
  security: [
    {
      bearerAuth: [],
    },
  ],
  params: idParamSchema,
  body: updateServerEventBodySchema,
};

export const deleteServerEventSchema: FastifySchema = {
  tags: ['Server event'],
  description: 'Delete server event',
  consumes: ['application/json'],
  produces: ['application/json'],
  security: [
    {
      bearerAuth: [],
    },
  ],
  params: idParamSchema,
};
