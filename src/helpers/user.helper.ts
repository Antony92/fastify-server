import type { RoleType, User, UserJWT } from '../modules/user/user.type.js';

export const hasUserRoles = (user: UserJWT | User, roles: RoleType[]) => {
  return roles.some((role) => user.roles.includes(role));
};
