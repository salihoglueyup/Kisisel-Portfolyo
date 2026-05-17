process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_access_secret';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';

const request = require('supertest');
const app = require('../app');
const AdminUser = require('../models/AdminUser');
const Blog = require('../models/Blog');
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

describe('Auth — login & brute-force kilidi', () => {
    test('Doğru bilgilerle giriş → accessToken + csrfToken + cookie', async () => {
        await seedSuperadmin();
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'super@test.com', password: 'Superpass1' });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.accessToken).toBeTruthy();
        expect(res.body.data.csrfToken).toBeTruthy();
        const cookies = res.headers['set-cookie'].join(';');
        expect(cookies).toMatch(/refreshToken=/);
        expect(cookies).toMatch(/csrfToken=/);
    });

    test('Yanlış şifre → 401, 5 denemeden sonra 429 kilit', async () => {
        await seedSuperadmin();
        for (let i = 0; i < 5; i++) {
            const r = await request(app)
                .post('/api/auth/login')
                .send({ email: 'super@test.com', password: 'wrongpass' });
            expect(r.statusCode).toBe(401);
        }
        // 6. deneme — doğru şifreyle bile olsa kilitli
        const locked = await request(app)
            .post('/api/auth/login')
            .send({ email: 'super@test.com', password: 'Superpass1' });
        expect(locked.statusCode).toBe(429);
        expect(locked.body.message).toMatch(/kilitli/i);
    });
});

describe('Auth — register yetkilendirme', () => {
    test('Token olmadan register → 401', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'new@test.com', password: 'Newpass123', displayName: 'New' });
        expect(res.statusCode).toBe(401);
    });

    test('Superadmin token ile register → 201', async () => {
        await seedSuperadmin();
        const login = await request(app)
            .post('/api/auth/login')
            .send({ email: 'super@test.com', password: 'Superpass1' });
        const token = login.body.data.accessToken;

        const res = await request(app)
            .post('/api/auth/register')
            .set('Authorization', `Bearer ${token}`)
            .send({ email: 'new@test.com', password: 'Newpass123', displayName: 'New' });

        expect(res.statusCode).toBe(201);
        expect(res.body.data.role).toBe('admin');
        expect(res.body.data).not.toHaveProperty('accessToken'); // token sızmamalı
    });
});

describe('Auth — CSRF korumalı refresh', () => {
    test('CSRF header olmadan refresh → 403', async () => {
        await seedSuperadmin();
        const agent = request.agent(app);
        await agent.post('/api/auth/login').send({ email: 'super@test.com', password: 'Superpass1' });

        const res = await agent.post('/api/auth/refresh').send({});
        expect(res.statusCode).toBe(403);
    });

    test('Cookie + doğru CSRF header ile refresh → yeni accessToken', async () => {
        await seedSuperadmin();
        const agent = request.agent(app);
        const login = await agent.post('/api/auth/login').send({ email: 'super@test.com', password: 'Superpass1' });
        const csrf = login.body.data.csrfToken;

        const res = await agent
            .post('/api/auth/refresh')
            .set('X-CSRF-Token', csrf)
            .send({});

        expect(res.statusCode).toBe(200);
        expect(res.body.data.accessToken).toBeTruthy();
    });
});

describe('Auth — şifre sıfırlama', () => {
    test('forgot-password → kullanıcı olsa da olmasa da generic 200', async () => {
        await seedSuperadmin();
        const a = await request(app).post('/api/auth/forgot-password').send({ email: 'super@test.com' });
        const b = await request(app).post('/api/auth/forgot-password').send({ email: 'yok@test.com' });
        expect(a.statusCode).toBe(200);
        expect(b.statusCode).toBe(200);
        expect(a.body.message).toBe(b.body.message); // sızıntı yok
    });

    test('Geçersiz token ile reset → 400', async () => {
        const res = await request(app)
            .post('/api/auth/reset-password/geçersiztoken')
            .send({ password: 'BrandNew123' });
        expect(res.statusCode).toBe(400);
    });
});

describe('Blog — arama / kategori / sayfalama', () => {
    beforeEach(async () => {
        await Blog.create([
            { title: 'React İpuçları', excerpt: 'react', content: 'x', category: 'Teknoloji' },
            { title: 'Kariyer Yolu', excerpt: 'kariyer', content: 'y', category: 'Kariyer' },
            { title: 'Node.js Derin', excerpt: 'node', content: 'z', category: 'Teknoloji' }
        ]);
    });

    test('Kategori filtresi yalnız o kategoriyi döndürür', async () => {
        const res = await request(app).get('/api/blogs?category=Kariyer');
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].category).toBe('Kariyer');
    });

    test('Arama başlık/excerpt eşleştirir', async () => {
        const res = await request(app).get('/api/blogs?search=node');
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].title).toMatch(/Node/);
    });

    test('Sayfalama meta verisi döner', async () => {
        const res = await request(app).get('/api/blogs?limit=2&page=1');
        expect(res.body.data).toHaveLength(2);
        expect(res.body.pagination).toMatchObject({ page: 1, limit: 2, total: 3, totalPages: 2 });
    });
});

describe('SEO — sitemap', () => {
    test('GET /sitemap.xml → blog URL içeren geçerli XML', async () => {
        await Blog.create({ title: 'Sitemap Test', excerpt: 'e', content: 'c', category: 'Teknoloji' });
        const res = await request(app).get('/sitemap.xml');
        expect(res.statusCode).toBe(200);
        expect(res.headers['content-type']).toMatch(/xml/);
        expect(res.text).toMatch(/<urlset/);
        expect(res.text).toMatch(/\/blog\//);
    });
});
