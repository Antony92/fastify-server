import os from 'node:os';
import { isDatabaseActive } from '../db/index.js';
import { formatBytes, secondsToElapsedTime } from '../helpers/format.helper.js';

export const checkHealthHandler = async () => {
	const { seconds, minutes, hours } = secondsToElapsedTime(os.uptime());
	const dbActive = await isDatabaseActive();
	const serverInfo = {
		uptime: `${hours}:${minutes}:${seconds}`,
		totalmem: formatBytes(os.totalmem()),
		freemem: formatBytes(os.freemem()),
		database: dbActive,
	};
	return serverInfo;
};
