import { getServerEvents, sendServerEvent } from '../services/server-event.service'

const test = async () => {
	getServerEvents.subscribe(event => console.log(1, event))
	sendServerEvent({ message: 'ola', type: 'info'})
	getServerEvents.subscribe(event => console.log(2, event))
}

test()
