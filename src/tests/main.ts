import prisma from '../db/prisma.js'
import { getServerEvents } from '../services/server-event.service.js'
import { createUser, getUserByUsername, getRoles, getUsers, updateUser } from '../services/user.service.js'

const data = await createUser({ name: 'test', username: 'test'})

console.log(data)
