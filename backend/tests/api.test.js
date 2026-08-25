const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Project = require('../models/Project');

let token;
let projectId;

beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/taskflow_test');
    await User.deleteMany({});
    await Project.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('TaskFlow Pro API Endpoints', () => {
    // 1. Auth - Register Success
    it('should register a new user successfully', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'test@example.com', password: 'password123' });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message');
    });

    // 2. Auth - Register Duplicate Fail
    it('should fail registration if user already exists', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'test@example.com', password: 'password123' });
        expect(res.statusCode).toEqual(400);
    });

    // 3. Auth - Login Validation Fail
    it('should fail login with empty inputs', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: '', password: '' });
        expect(res.statusCode).toEqual(400);
    });

    // 4. Auth - Login Wrong Password Fail
    it('should fail login with incorrect password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'wrongpassword' });
        expect(res.statusCode).toEqual(400);
    });

    // 5. Auth - Login Success & Return JWT
    it('should log in successfully and return a token', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'password123' });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
    });

    // 6. CRUD - Create Project Auth Failure
    it('should deny project creation if token is missing', async () => {
        const res = await request(app)
            .post('/api/projects')
            .send({ title: 'New Proj', description: 'Desc' });
        expect(res.statusCode).toEqual(401);
    });

    // 7. CRUD - Create Project Success
    it('should create a new project under authenticated user', async () => {
        const res = await request(app)
            .post('/api/projects')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Build Mobile App', description: 'Use Android Studio and Java' });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        projectId = res.body._id;
    });

    // 8. CRUD - Read Projects Success
    it('should fetch all projects belonging to the logged-in user', async () => {
        const res = await request(app)
            .get('/api/projects')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    // 9. CRUD - Update Project Success
    it('should update project fields properly', async () => {
        const res = await request(app)
            .put(`/api/projects/${projectId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Build Mobile App (Updated)' });
        expect(res.statusCode).toEqual(200);
        expect(res.body.title).toEqual('Build Mobile App (Updated)');
    });

    // 10. CRUD - Delete Project Success
    it('should delete a project cleanly', async () => {
        const res = await request(app)
            .delete(`/api/projects/${projectId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
    });
});
