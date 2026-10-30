import { idParamSchema } from '../../schemas/request.schema.js';
import type { FastifySchema } from 'fastify';

export const createUserApiKeySchema: FastifySchema = {
  tags: ['User'],
  description: 'Create user api key',
  consumes: ['application/json'],
  produces: ['application/json'],
  security: [
    {
      bearerAuth: [],
    },
  ],
  params: idParamSchema,
};

export const deleteUserApiKeySchema: FastifySchema = {
  tags: ['User'],
  description: 'Delete user api key',
  consumes: ['application/json'],
  produces: ['application/json'],
  security: [
    {
      bearerAuth: [],
    },
  ],
  params: idParamSchema,
};
