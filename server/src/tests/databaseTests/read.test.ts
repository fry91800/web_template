import request from 'supertest';
import app from '../../server';
import { User } from '../../database/models/User';

describe('POST /database/read', () => {
    it('should send back the database', async () => {
        const response = await request(app)
            .get('/database/read')
        expect(response.status).toBe(200);
    });
});
