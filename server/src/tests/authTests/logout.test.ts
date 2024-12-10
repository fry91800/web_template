import request from 'supertest';
import app from '../../server';
import { User } from '../../database/models/User';

describe('POST /auth/logout', () => {
    it('should logout successfully', async () => {
        await User.create({ email: 'test@example.com', pass: 'password123' });
        await request(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', pass: 'password123' });
        const response = await request(app)
            .post('/auth/logout')
        expect(response.status).toBe(200);
    });
});
