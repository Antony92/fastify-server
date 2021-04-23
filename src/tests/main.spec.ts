import server from '../server'

const test = async () => {
	const req = await server.inject({ method: 'GET', url: '/api/v1/health' })
    console.log(req)
    server.close()
}

test()
