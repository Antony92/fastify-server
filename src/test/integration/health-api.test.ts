import { expect, describe, it } from 'vitest'
import server from '../../server.js'

describe('Health check route', () => {
	describe('GET /api/v1/health', () => {
		it(`it should return status 200 and contain server info`, async () => {
			const req = await server.inject({ method: 'GET', url: '/api/v1/health' })
            const body = req.json()
            expect(req.statusCode).to.be.eq(200)
            expect(body).to.have.property('uptime')
		})
	})
})

