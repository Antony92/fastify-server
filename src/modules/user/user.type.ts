import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { rolesEnum, usersTable } from '../../db/schema.js';
import { createInsertSchema, createUpdateSchema } from 'drizzle-orm/typebox';
import { type Static, Type } from 'typebox';
import { paginationQuerySchema } from '../../types/request.type.js';

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

export type UserJWT = {
  id: string;
  name: string;
  username: string;
  roles: string[];
  impersonated?: string;
};

export type RoleType = (typeof rolesEnum.enumValues)[number];

export const Role = {
  GUEST: 'guest',
  ADMIN: 'admin',
} as const satisfies Record<string, RoleType>;

export type User = InferSelectModel<typeof usersTable>;

export type CreateUser = InferInsertModel<typeof usersTable>;

export type UpdateUser = { id: string } & Partial<InferInsertModel<typeof usersTable>>;

export type CreateUserBody = Static<typeof createUserBodySchema>;

export type UpdateUserBody = Static<typeof updateUserBodySchema>;

export type UserSearchQuery = Static<typeof userSearchQuerySchema>;
