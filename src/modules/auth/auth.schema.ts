import Type from 'typebox';
import type { FastifySchema } from 'fastify';

export const impersonateUserBodySchema = Type.Object({
  username: Type.String(),
});

export const impersonateUserSchema: FastifySchema = {
  tags: ['User'],
  description: 'Impersonate user',
  hide: true,
  consumes: ['application/json'],
  produces: ['application/json'],
  security: [
    {
      bearerAuth: [],
    },
  ],
  body: impersonateUserBodySchema,
};
