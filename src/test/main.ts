import prisma from '../db/prisma.js'
import { getServerEvents } from '../services/server-event.service.js'
import { createUser, getUserByUsername, getUserRoles, getUsers, updateUser } from '../services/user.service.js'

const data = await getUserByUsername('test2')

console.log(data)
