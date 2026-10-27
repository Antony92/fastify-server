import { createInsertSchema, createUpdateSchema } from 'drizzle-orm/typebox';
import Type from 'typebox';
import { usersTable } from '../../db/schema.js';
import { idParamSchema, paginationQuerySchema } from '../../types/request.type.js';
import type { FastifySchema } from 'fastify';

export const createUserBodySchema = Type.Pick(createInsertSchema(usersTable), [
  'name',
  'username',
  'roles',
  'active',
  'blocked',
]);

export const updateUserBodySchema = Type.Pick(createUpdateSchema(usersTable), [
  'name',
  'username',
  'roles',
  'active',
  'blocked',
]);

export const userSearchQuerySchema = Type.Intersect([
  paginationQuerySchema,
  Type.Object({
    name: Type.Optional(Type.String()),
    username: Type.Optional(Type.String()),
    active: Type.Optional(Type.Boolean()),
    blocked: Type.Optional(Type.Boolean()),
    internal: Type.Optional(Type.Boolean()),
    roles: Type.Optional(Type.String()),
  }),
]);

export const getUserSchema: FastifySchema = {
  tags: ['User'],
  description: 'Get user',
  consumes: ['application/json'],
  produces: ['application/json'],
  security: [
    {
      bearerAuth: [],
    },
  ],
  params: idParamSchema,
};

export const getRolesSchema: FastifySchema = {
  tags: ['User'],
  description: 'Get roles',
  consumes: ['application/json'],
  produces: ['application/json'],
  security: [
    {
      bearerAuth: [],
    },
  ],
};

export const getUsersSchema: FastifySchema = {
  tags: ['User'],
  description: 'Get users',
  consumes: ['application/json'],
  produces: ['application/json'],
  security: [
    {
      bearerAuth: [],
    },
  ],
  querystring: userSearchQuerySchema,
};

export const createUserSchema: FastifySchema = {
  tags: ['User'],
  description: 'Create user',
  consumes: ['application/json'],
  produces: ['application/json'],
  security: [
    {
      bearerAuth: [],
    },
  ],
  body: createUserBodySchema,
};

export const updateUserSchema: FastifySchema = {
  tags: ['User'],
  description: 'Update user',
  consumes: ['application/json'],
  produces: ['application/json'],
  security: [
    {
      bearerAuth: [],
    },
  ],
  params: idParamSchema,
  body: updateUserBodySchema,
};

export const deleteUserSchema: FastifySchema = {
  tags: ['User'],
  description: 'Delete user',
  consumes: ['application/json'],
  produces: ['application/json'],
  security: [
    {
      bearerAuth: [],
    },
  ],
  params: idParamSchema,
};

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
