import { User } from '@prisma/client'
import { Role, UserJWT } from '../types/user.type.js'

export const hasUserRoles = (user: UserJWT | User, roles: Role[]) => {
    return user.roles.some((role: Role) => roles.includes(role))
}
