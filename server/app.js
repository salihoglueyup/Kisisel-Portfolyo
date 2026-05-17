// Express uygulamasını oluşturur ve döndürür.
// Port dinleme / DB bağlantısı index.js'te — bu sayede testlerde
// uygulama port açmadan import edilebilir.
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('./middleware/sanitize');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const path = require('path');
const morgan = require('morgan');
const logger = require('./config/logger');
const messageRoutes = require('./routes/messageRoutes');
const blogRoutes = require('./routes/blogRoutes');
const projectRoutes = require('./routes/projectRoutes');
const authRoutes = require('./routes/authRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const { getSitemap } = require('./controllers/sitemapController');

const isTest = process.env.NODE_ENV === 'test';

const app = express();

// --- Güvenlik Kalkanları (en önce — TÜM yanıtlara, statik dosyalar dahil) ---
app.use(helmet()); // HTTP başlık güvenliği

// CORS — sadece frontend origin'e izin ver
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));

// Morgan Middleware - HTTP isteklerini logla (testte sessiz)
if (!isTest) {
    const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
    app.use(morgan(morganFormat, {
        stream: { write: (message) => logger.info(message.trim()) }
    }));
}

// Body parser (2MB — JSON gövdesi için yeterli; görsel yüklemeleri multer ile 5MB sınırlı)
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: true }));

// Cookie parser — httpOnly refresh token cookie'sini okumak için
app.use(cookieParser());

// Gövde/sorgu ayrıştırıldıktan SONRA temizle
app.use(mongoSanitize()); // NoSQL Injection koruması
app.use(hpp()); // HTTP Parameter Pollution (HPP) koruması

// Statik Dosyalar (Yüklenen Görseller) — helmet başlıkları artık bunlara da uygulanır
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate Limiter'lar (testte devre dışı — testler limite takılmasın)
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: 'Çok fazla istek gönderildi. Lütfen 15 dakika sonra tekrar deneyin.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { success: false, message: 'Çok fazla giriş denemesi. Lütfen 15 dakika sonra tekrar deneyin.' },
    standardHeaders: true,
    legacyHeaders: false,
});

if (!isTest) {
    app.use(generalLimiter);
}

// Ana route
app.get('/', (req, res) => {
    res.send('API Çalışıyor! YBS Portfolio Backend Hazır.');
});

// Health check — deployment monitoring
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString()
    });
});

// SEO — dinamik sitemap
app.get('/sitemap.xml', getSitemap);

// API Routes
app.use('/api/auth', isTest ? authRoutes : [authLimiter, authRoutes]);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/blogs', blogRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

module.exports = app;
