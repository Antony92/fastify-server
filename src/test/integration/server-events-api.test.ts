import { JWT } from '@fastify/jwt'
import { Role } from '@prisma/client'
import { expect, describe, it } from 'vitest'
import server from '../../server.js'
import { UserJWT } from '../../types/user.type.js'

const admin: UserJWT = {
    id: 'admin',
    name: 'admin',
    username: 'admin@test.com',
    roles: [Role.ADMIN]
}

const jwt = (server.jwt['access'] as JWT).sign({ user: admin })

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

