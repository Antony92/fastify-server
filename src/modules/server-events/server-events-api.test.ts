import assert from 'node:assert';
import { describe, it } from 'node:test';
import server from '../../server.js';
import { Role } from '../user/user.type.js';

const admin = {
  id: 'admin',
  name: 'admin',
  username: 'admin@test.com',
  roles: [Role.ADMIN],
  use: 'session' as const,
};

const jwt = server.jwt.access.sign({ ...admin });

describe('Server events route', () => {
  describe('GET /api/v1/server-events', () => {
    it(`it should return status 200 and contain data array object`, async () => {
      const req = await server.inject({
        method: 'GET',
        url: '/api/v1/server-events',
        headers: { authorization: `Bearer ${jwt}` },
      });
      const body = req.json();
      assert.strictEqual(req.statusCode, 200);
      assert.ok(!!body.uptime);
      assert.ok(Array.isArray(body.data));
    });
  });
});
