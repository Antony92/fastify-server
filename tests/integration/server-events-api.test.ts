import { Role } from '../../src/db/prisma/client.js'
import server from '../../src/server.js'
import { describe, it } from 'node:test'
import assert from 'node:assert'
import { UserJWT } from '../../src/types/user.type.js'
import { JWT } from '@fastify/jwt'

const admin: UserJWT = {
	id: 'admin',
	name: 'admin',
	username: 'admin@test.com',
	roles: [Role.ADMIN],
}

const jwt = (server.jwt as JWT & { access: JWT }).access.sign({ user: admin })

describe('Server events route', () => {
	describe('GET /api/v1/server-events', () => {
		it(`it should return status 200 and contain data array object`, async () => {
			const req = await server.inject({
				method: 'GET',
				url: '/api/v1/server-events',
				headers: { authorization: `Bearer ${jwt}` },
			})
			const body = req.json()
			assert.strictEqual(req.statusCode, 200)
			assert.ok(!!body.uptime)
			assert.ok(Array.isArray(body.data))
		})
	})
})
