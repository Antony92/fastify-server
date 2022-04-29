import pino from 'pino'
import fs from 'fs'
import config from '../config'

const isProduction = process.env.NODE_ENV === 'production' || config.environment === 'production'

if (isProduction && !fs.existsSync('./logs')) fs.mkdirSync('./logs')

const multistream = pino.multistream(
	[
		{ stream: process.stdout },
		{ level: 'info', stream: pino.destination(`./logs/app.log`) },
		{ level: 'error', stream: pino.destination(`./logs/app-error.log`) },
	],
	{
		dedupe: false,
	}
)

const log = pino(
	{
		level: 'info',
		formatters: {
			level: (label: string) => ({ level: label }),
		},
	},
	isProduction ? multistream : null
)

export default log
