import prisma from '../db/prisma.js'
import { getServerEvents } from '../services/server-event.service.js'

const data = await getServerEvents()

console.log(data)
