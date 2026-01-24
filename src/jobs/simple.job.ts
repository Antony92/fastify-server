import { AsyncTask, CronJob } from "toad-scheduler"

const task = new AsyncTask(
    'simple task (every monday at 5 AM)',
    async () => {
      console.log('job running')
    },
    (error) => console.log(error)
)

export const simpleJob = new CronJob({ cronExpression: '1 5 * * 1' }, task)
