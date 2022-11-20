import { Roles } from '../models/user.model'
import { User } from '../types/user.type'

export const getUser = async (email: string): Promise<User> => {
    // check againts DB
    return {
        name: 'admin',
        email,
        roles: [Roles.ADMIN]
    }
}
