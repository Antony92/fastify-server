import prisma from '../db/prisma.js'
import { getServerEvents } from '../services/server-event.service.js'
import { getUserRoles, getUsers } from '../services/user.service.js'

const data = getUserRoles()

console.log(data)
