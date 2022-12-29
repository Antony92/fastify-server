import prisma from '../db/prisma.js'
import { getServerEvents } from '../services/server-event.service.js'
import { getRoles, getUsers } from '../services/user.service.js'

const data = getRoles()

console.log(data)
