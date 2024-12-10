import request from 'supertest';
import app from '../../server';
import { User } from '../../database/models/User';

describe('POST /database/write', () => {
    it('should insert', async () => {
        const response = await request(app)
            .post('/database/write')
            .send({ type: 'insert', table: 'User', data: {email:"test@gmail.com", pass: "123456"} });
        expect(response.status).toBe(200);
    });
    it('should update', async () => {
        await User.create({ id: "086339a8-68f8-4cc7-a8c7-469432df0584", email: 'test@example.com', pass: 'password123' });
        const response = await request(app)
            .post('/database/write')
            .send({ type: 'update', table: 'User', data: {email:"test@gmail.com", pass: "123456"}, where: {id: "086339a8-68f8-4cc7-a8c7-469432df0584"}});
        expect(response.status).toBe(200);
    });
    it('should delete', async () => {
        await User.create({ id: "086339a8-68f8-4cc7-a8c7-469432df0584", email: 'test@example.com', pass: 'password123' });
        const response = await request(app)
            .post('/database/write')
            .send({ type: 'delete', table: 'User', data: {email:"test@gmail.com", pass: "123456"}, where: {id: "086339a8-68f8-4cc7-a8c7-469432df0584"}});
        expect(response.status).toBe(200);
    });
    it('should fail because the table does not exist', async () => {
        const response = await request(app)
            .post('/database/write')
            .send({ type: 'insert', table: 'noexist', data: {email:"test@gmail.com", pass: "123456"} });
        expect(response.status).toBe(400);
    });
    it('should fail because the operation type does not exist', async () => {
        const response = await request(app)
            .post('/database/write')
            .send({ type: 'noexist', table: 'User', data: {email:"test@gmail.com", pass: "123456"} });
        expect(response.status).toBe(400);
    });
});
