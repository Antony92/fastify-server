import { User, Roles } from '../types/user.type.js'

export const getUser = async (email: string) => {
    // check againts DB
    const user: User = {
        name: 'admin',
        email,
        roles: [Roles.ADMIN]
    }
    return user
}
