import prisma from '../db/prisma.js'
import { getServerEvents } from '../services/server-event.service.js'
import { getUsers } from '../services/user.service.js'

const data = await getUsers()

console.log(data)
