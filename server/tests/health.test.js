// app.js'i port açmadan / DB'ye bağlanmadan test eder.
process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../app');

describe('Temel endpoint\'ler', () => {
    test('GET / -> API çalışıyor mesajı', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.text).toMatch(/API Çalışıyor/);
    });

    test('GET /api/health -> ok durumu', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
        expect(typeof res.body.uptime).toBe('number');
    });

    test('Helmet güvenlik başlıkları mevcut', async () => {
        const res = await request(app).get('/');
        expect(res.headers['x-content-type-options']).toBe('nosniff');
        expect(res.headers).toHaveProperty('x-dns-prefetch-control');
    });

    test('Bilinmeyen route -> 404', async () => {
        const res = await request(app).get('/api/bilinmeyen-yol');
        expect(res.statusCode).toBe(404);
    });
});

describe('Auth doğrulama (DB gerektirmez)', () => {
    test('POST /api/auth/login eksik alanlarla 400', async () => {
        const res = await request(app).post('/api/auth/login').send({});
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test('POST /api/auth/register token olmadan 401', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'x@y.com', password: 'Secret123', displayName: 'X' });
        expect(res.statusCode).toBe(401);
    });

    test('POST /api/auth/refresh CSRF olmadan 403', async () => {
        const res = await request(app).post('/api/auth/refresh').send({});
        expect(res.statusCode).toBe(403);
    });

    test('POST /api/auth/logout CSRF olmadan 403', async () => {
        const res = await request(app).post('/api/auth/logout').send({});
        expect(res.statusCode).toBe(403);
    });
});
