import { describe, it } from 'node:test'
import assert from 'node:assert'
import server from '../../server.js'

describe('Health check route', () => {
	describe('GET /api/v1/health', () => {
		it(`it should return status 200 and contain server info`, async () => {
			const req = await server.inject({ method: 'GET', url: '/api/v1/health' })
            const body = req.json()
            assert.strictEqual(req.statusCode, 200)
            assert.ok(!!body.uptime)
		})
	})
})

