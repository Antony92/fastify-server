import server from '../server.js'
import { Roles, User } from '../types/user.type.js'

const user: User = {
    name: 'admin',
    email: 'admin@test.com',
    roles: [Roles.ADMIN]
}

const jwt = server.jwt['access'].sign(user)

console.log(jwt)