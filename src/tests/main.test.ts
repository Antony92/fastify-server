import server from '../server'

server.log.level = 'silent'

const test = async () => {
	const req = await server.inject({ method: 'GET', url: '/api/v1/health' })
    const res = await req.json()
    console.log(res)
    server.close()
}

test()
