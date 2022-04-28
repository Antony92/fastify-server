import { Roles, User } from '../models/user.model'
import crypto from 'crypto'

export const getUser = async (email: string, password: string): Promise<User> => {
    // check user againts db
    if (email === 'admin@test.com' && password === 'admin') {
        return {
            jti: crypto.randomBytes(30).toString('hex'),
            name: 'admin',
            email,
            roles: [Roles.ADMIN]
        }
    }
    return null
}
