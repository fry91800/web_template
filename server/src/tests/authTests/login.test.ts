import request from 'supertest';
import app from '../../server';
import { User } from '../../database/models/User';

describe('POST /auth/login', () => {
    it('should log in', async () => {
        await User.create({ email: 'test@example.com', pass: 'password123' });
        const response = await request(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', pass: 'password123' });
        expect(response.status).toBe(200);
    });

    it('should fail if the email does not exist', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', pass: 'password123' });
        expect(response.status).toBe(400);
    });

    it('should fail if the password is wrong', async () => {
        await User.create({ email: 'test@example.com', pass: 'password123' });
        const response = await request(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', pass: 'wrong123' });
        expect(response.status).toBe(400);
    });

    it('should fail if the email is null', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ email: null, pass: 'password123' });
        expect(response.status).toBe(400);
    });
    it('should fail if the pass is null', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ email: 'test@gmail.com', pass: null });
        expect(response.status).toBe(400);
    });
});
