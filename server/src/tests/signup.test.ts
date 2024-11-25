import request from 'supertest';
import app from '../server'; // Your Express app
import { User } from '../database/models/User'; // Sequelize User model

describe('POST /auth/signup', () => {
    it('should create a new user', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({ email: 'test@example.com', pass: 'password123' });
        expect(response.status).toBe(201);
    });

    it('should fail if the user already exists', async () => {
        // Create the user first
        await User.create({ email: 'test@example.com', pass: 'password123' });

        // Try to sign up with the same email
        const response = await request(app)
            .post('/auth/signup')
            .send({ email: 'test@example.com', pass: 'password123' });

        expect(response.status).toBe(400);
    });

    it('should fail if the mail is empty', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({ email: '', pass: 'password123' });

        expect(response.status).toBe(400);
    });

    it('should fail if the mail is invalid', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({ email: 'test', pass: 'password123' });

        expect(response.status).toBe(400);
    });
    it('should fail if the pass is empty', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({ email: 'test@gmail.com', pass: '' });

        expect(response.status).toBe(400);
    });

    it('should fail if the pass is invalid', async () => {
        // Try to sign up with the same email
        const response = await request(app)
            .post('/auth/signup')
            .send({ email: 'test@gmail.com', pass: 'short' });

        expect(response.status).toBe(400);
    });
});
