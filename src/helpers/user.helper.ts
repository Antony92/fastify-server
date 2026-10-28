import type { Role, User, UserJWT } from '../modules/user/user.type.js';

export const hasUserRoles = (user: UserJWT | User, roles: Role[]) => {
  return roles.some((role) => user.roles.includes(role));
};
