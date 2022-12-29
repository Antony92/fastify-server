import { expect, describe, it } from 'vitest'
import server from '../../server.js'
import { Role, User } from '../../types/user.type.js'

const admin: Partial<User> = {
    name: 'admin',
    email: 'admin@test.com',
    roles: [Role.ADMIN]
}

const jwt = server.jwt['access'].sign({ user: admin })

describe('Server events route', () => {
	describe('GET /api/v1/server-events', () => {
		it(`it should return status 200 and contain data array object`, async () => {
			const req = await server.inject(
                { 
                    method: 'GET', 
                    url: '/api/v1/server-events', 
                    headers: { authorization: `Bearer ${jwt}`} 
                }
            )
            const body = req.json()
            expect(req.statusCode).toBe(200)
            expect(body).toHaveProperty('data')
            expect(body.data).toBeInstanceOf(Array)
		})
	})
})

