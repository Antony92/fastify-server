import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { rolesEnum, usersTable } from '../../db/schema.js';
import { type Static } from 'typebox';
import {
  createUserBodySchema,
  updateUserBodySchema,
  userSearchQuerySchema,
} from './user.schema.js';

export type Role = (typeof rolesEnum.enumValues)[number];

export const Role = {
  GUEST: 'guest',
  ADMIN: 'admin',
} as const satisfies Record<string, Role>;

export type User = InferSelectModel<typeof usersTable>;

export type CreateUser = InferInsertModel<typeof usersTable>;

export type UpdateUser = { id: string } & Partial<InferInsertModel<typeof usersTable>>;

export type CreateUserBody = Static<typeof createUserBodySchema>;

export type UpdateUserBody = Static<typeof updateUserBodySchema>;

export type UserSearchQuery = Static<typeof userSearchQuerySchema>;
