import { Roles, User } from '../models/user.model'

export const getUser = async (email: string, password: string): Promise<User> => {
    // check user againts db
    if (email === 'admin@test.com' && password === 'admin') {
        return {
            name: 'admin',
            email,
            roles: [Roles.ADMIN]
        }
    }
    return null
}
