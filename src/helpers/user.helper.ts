import type { Role, User } from '../modules/user/user.type.js';
import { AccessToken } from '../types/jwt.type.js';

export const hasUserRoles = (user: AccessToken | User, roles: Role[]) => {
  return roles.some((role) => user.roles.includes(role));
};
