import type { User } from '../db/prisma/client.js';
import type { RoleType, UserJWT } from '../types/user.type.js';

export const hasUserRoles = (user: UserJWT | User, roles: RoleType[]) => {
	return user.roles.some((role) => roles.includes(role as RoleType));
};
