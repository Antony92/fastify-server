import pino from 'pino'

const log = pino(
	{
		level: 'info',
		formatters: {
			level: (label: string) => ({ level: label }),
		},
	},
	pino.multistream(
		[
			{ stream: process.stdout },
			{ level: 'info', stream: pino.destination(`./logs/app.log`) },
			{ level: 'error', stream: pino.destination(`./logs/app-error.log`) },
		],
		{
			dedupe: false
		}
	)
)

export default log
