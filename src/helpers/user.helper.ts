import type { RoleType, User, UserJWT } from '../modules/user/user.type.js';

export const hasUserRoles = (user: UserJWT | User, roles: RoleType[]) => {
  return user.roles.some((role) => roles.includes(role as RoleType));
};
