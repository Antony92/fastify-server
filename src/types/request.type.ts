export type LoginRequest = {
	Body: {
		email: string,
		password: string
	}
}

export type CreateServerEventRequest = {
	Body: {
		type: string,
		message: string
	}
}
