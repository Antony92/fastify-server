import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { usersTable } from '../db/schema.js';
import type { PaginationQuery } from './request.type.js';

export type UserJWT = {
	id: string;
	name: string;
	username: string;
	roles: string[];
	impersonated?: string;
};

export const Role = {
	GUEST: 'guest',
	ADMIN: 'admin',
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];

export type User = InferSelectModel<typeof usersTable>;

export type CreateUser = InferInsertModel<typeof usersTable>;

export type UpdateUser = { id: string } & InferInsertModel<typeof usersTable>;

export type CreateUserBody = Pick<CreateUser, 'name' | 'username' | 'roles' | 'active' | 'blocked'>;

export type UpdateUserBody = Pick<UpdateUser, 'name' | 'username' | 'roles' | 'active' | 'blocked'>;

export type UserSearchQuery = PaginationQuery & {
	name?: string;
	username?: string;
	active?: boolean;
	blocked?: boolean;
	internal?: boolean;
	roles?: string;
};
