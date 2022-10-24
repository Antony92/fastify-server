import { Roles, User } from '../models/user.model'

export const getUser = async (email: string): Promise<User> => {
    // check againts DB
    return {
        name: 'admin',
        email,
        roles: [Roles.ADMIN]
    }
}
