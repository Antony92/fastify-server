import { concatMap, BehaviorSubject, shareReplay } from 'rxjs'
import { ServerEvent } from '../models/server-event.model'

const $event = new BehaviorSubject<ServerEvent>(null)

export const getServerEvents = $event.asObservable().pipe(
		shareReplay(1), 
		concatMap(async (event) => event ? event : getLastServerEvent())
	)

export const getLastServerEvent = async () => {
	const event: ServerEvent = { message: 'info', type: 'info' }
	return event
}

export const sendServerEvent = (event: ServerEvent) => {
	$event.next(event)
}




