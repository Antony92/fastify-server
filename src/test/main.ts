import { getServerEventsObservable, sendServerEvent } from '../services/server-event.service'

const test = async () => {
	getServerEventsObservable().subscribe(event => console.log(1, event))
	sendServerEvent({ message: 'ola', type: 'info'})
	getServerEventsObservable().subscribe(event => console.log(2, event))
}

test()
