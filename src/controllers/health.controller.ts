import { FastifyReply, FastifyRequest } from 'fastify'
import os from 'os'
import { formatBytes, secondsToElapsedTime } from '../helpers/format.helper'

export const checkHealthHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	const { seconds, minutes, hours } = secondsToElapsedTime(os.uptime())
	const serverInfo = {
		uptime: `${hours}:${minutes}:${seconds}`,
		totalmem: formatBytes(os.totalmem()),
		freemem: formatBytes(os.freemem()),
	}
	return serverInfo
}
