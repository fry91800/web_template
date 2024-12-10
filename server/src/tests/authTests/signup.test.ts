import request from 'supertest';
import app from '../../server';
import { User } from '../../database/models/User';

describe('POST /auth/signup', () => {
    it('should create a new user', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({ email: 'test@example.com', pass: 'password123' });
        expect(response.status).toBe(201);
    });

    it('should fail if the user already exists', async () => {
        await User.create({ email: 'test@example.com', pass: 'password123' });
        const response = await request(app)
            .post('/auth/signup')
            .send({ email: 'test@example.com', pass: 'password123' });
        expect(response.status).toBe(400);
    });

    it('should fail if the mail is null', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({ email: null, pass: 'password123' });
        expect(response.status).toBe(400);
    });

    it('should fail if the email is not a email format', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({ email: 'test', pass: 'password123' });
        expect(response.status).toBe(400);
    });
    it('should fail if the pass is null', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({ email: 'test@gmail.com', pass: null });
        expect(response.status).toBe(400);
    });

    it('should fail if the pass is shorter than 6 characters', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({ email: 'test@gmail.com', pass: 'short' });
        expect(response.status).toBe(400);
    });
});
