import os from 'node:os';
import { formatBytes, secondsToElapsedTime } from '../../helpers/format.helper.js';

export const checkHealthHandler = async () => {
  const { seconds, minutes, hours } = secondsToElapsedTime(os.uptime());
  const serverInfo = {
    uptime: `${hours}:${minutes}:${seconds}`,
    totalmem: formatBytes(os.totalmem()),
    freemem: formatBytes(os.freemem()),
    version: '1.0.0',
  };
  return serverInfo;
};
