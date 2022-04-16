import { User } from '../models/user.model'
import crypto from 'crypto'

export const getUser = async (email: string, password: string): Promise<User> => {
    // check user againts db
    const roles = []
    if (email === 'admin@test.com' && password === 'admin') roles.push('admin')
    return {
        jti: crypto.randomBytes(30).toString('hex'),
        name: 'user',
        email,
        roles
    }
}
