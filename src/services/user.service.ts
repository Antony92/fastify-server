import { Roles } from '../models/user.model.js'
import { User } from '../types/user.type.js'

export const getUser = async (email: string): Promise<User> => {
    // check againts DB
    return {
        name: 'admin',
        email,
        roles: [Roles.ADMIN]
    }
}
