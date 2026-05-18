// Oturum geçersizleştirme (tokenVersion) + updateProfile validasyonu +
// contactLimiter eklenmiş mesaj route'unun bütünlüğü.
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_access_secret';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';

const request = require('supertest');
const app = require('../app');
const AdminUser = require('../models/AdminUser');
const { connect, closeDatabase, clearDatabase } = require('./helpers/db');

beforeAll(connect);
afterAll(closeDatabase);
afterEach(clearDatabase);

const seedSuperadmin = () =>
    AdminUser.create({
        email: 'super@test.com',
        password: 'Superpass1',
        displayName: 'Super',
        role: 'superadmin'
    });

describe('Oturum geçersizleştirme — şifre değişimi', () => {
    test('Şifre değişince eski access token reddedilir (tv uyuşmazlığı)', async () => {
        await seedSuperadmin();
        const login = await request(app)
            .post('/api/auth/login')
            .send({ email: 'super@test.com', password: 'Superpass1' });
        const oldToken = login.body.data.accessToken;

        const change = await request(app)
            .put('/api/auth/password')
            .set('Authorization', `Bearer ${oldToken}`)
            .send({ currentPassword: 'Superpass1', newPassword: 'Superpass2' });
        expect(change.statusCode).toBe(200);

        // Aynı (artık eski) access token ile profil → 401
        const profile = await request(app)
            .get('/api/auth/profile')
            .set('Authorization', `Bearer ${oldToken}`);
        expect(profile.statusCode).toBe(401);
        expect(profile.body.message).toMatch(/oturum sonland/i);
    });

    test('Şifre değişince eski refresh token ile yenileme reddedilir', async () => {
        await seedSuperadmin();
        const agent = request.agent(app);
        const login = await agent
            .post('/api/auth/login')
            .send({ email: 'super@test.com', password: 'Superpass1' });
        const csrf = login.body.data.csrfToken;
        const accessToken = login.body.data.accessToken;

        await agent
            .put('/api/auth/password')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ currentPassword: 'Superpass1', newPassword: 'Superpass2' });

        // Eski refresh cookie hâlâ agent'ta; tv arttığı için refresh → 401
        const refresh = await agent
            .post('/api/auth/refresh')
            .set('X-CSRF-Token', csrf)
            .send({});
        expect(refresh.statusCode).toBe(401);
    });

    test('Geçerli oturum şifre değişmeden çalışmaya devam eder', async () => {
        await seedSuperadmin();
        const login = await request(app)
            .post('/api/auth/login')
            .send({ email: 'super@test.com', password: 'Superpass1' });
        const profile = await request(app)
            .get('/api/auth/profile')
            .set('Authorization', `Bearer ${login.body.data.accessToken}`);
        expect(profile.statusCode).toBe(200);
        expect(profile.body.data.email).toBe('super@test.com');
    });
});

describe('updateProfile — girdi validasyonu', () => {
    const loginToken = async () => {
        await seedSuperadmin();
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'super@test.com', password: 'Superpass1' });
        return res.body.data.accessToken;
    };

    test('Geçersiz email → 400', async () => {
        const token = await loginToken();
        const res = await request(app)
            .put('/api/auth/profile')
            .set('Authorization', `Bearer ${token}`)
            .send({ email: 'gecersiz-email' });
        expect(res.statusCode).toBe(400);
    });

    test('Çok kısa displayName → 400', async () => {
        const token = await loginToken();
        const res = await request(app)
            .put('/api/auth/profile')
            .set('Authorization', `Bearer ${token}`)
            .send({ displayName: 'A' });
        expect(res.statusCode).toBe(400);
    });

    test('Geçerli displayName → 200 ve kalıcı', async () => {
        const token = await loginToken();
        const res = await request(app)
            .put('/api/auth/profile')
            .set('Authorization', `Bearer ${token}`)
            .send({ displayName: 'Yeni Ad' });
        expect(res.statusCode).toBe(200);
        expect(res.body.data.displayName).toBe('Yeni Ad');
    });
});

describe('İletişim route — contactLimiter sonrası bütünlük', () => {
    test('Geçerli mesaj → 201 (limiter testte no-op)', async () => {
        const res = await request(app)
            .post('/api/messages')
            .send({
                name: 'Ziyaretçi',
                email: 'ziyaretci@test.com',
                subject: 'Merhaba',
                message: 'Test mesajı içeriği.'
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
    });

    test('Eksik alan → 400 (validateMessage)', async () => {
        const res = await request(app)
            .post('/api/messages')
            .send({ name: 'Ziyaretçi' });
        expect(res.statusCode).toBe(400);
    });
});
