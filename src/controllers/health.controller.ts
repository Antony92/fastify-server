import os from 'os'
import { isPrismaActive } from '../db/prisma.js'
import { formatBytes, secondsToElapsedTime } from '../helpers/format.helper.js'

export const checkHealthHandler = async () => {
	const { seconds, minutes, hours } = secondsToElapsedTime(os.uptime())
	const dbActive = await isPrismaActive()
	const serverInfo = {
		uptime: `${hours}:${minutes}:${seconds}`,
		totalmem: formatBytes(os.totalmem()),
		freemem: formatBytes(os.freemem()),
		database: dbActive
	}
	return serverInfo
}
