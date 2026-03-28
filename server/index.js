const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const path = require('path');
const connectDB = require('./config/db');
const messageRoutes = require('./routes/messageRoutes');
const blogRoutes = require('./routes/blogRoutes');
const projectRoutes = require('./routes/projectRoutes');
const authRoutes = require('./routes/authRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const morgan = require('morgan');
const logger = require('./config/logger');

dotenv.config();

connectDB();

const app = express();

// CORS — sadece frontend origin'e izin ver
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

// Morgan Middleware - HTTP isteklerini logla
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}));

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Statik Dosyalar (Yüklenen Görseller)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Güvenlik Kalkanları (Security Middlewares)
app.use(helmet()); // HTTP başlık güvenliği
app.use(xss()); // Cross Site Scripting (XSS) koruması
app.use(mongoSanitize()); // NoSQL Injection koruması
app.use(hpp()); // HTTP Parameter Pollution (HPP) koruması

// Genel Rate Limiter (100 istek / 15 dakika)
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Çok fazla istek gönderildi. Lütfen 15 dakika sonra tekrar deneyin.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(generalLimiter);

// Auth Rate Limiter (5 login denemesi / 15 dakika)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Çok fazla giriş denemesi. Lütfen 15 dakika sonra tekrar deneyin.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

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

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/blogs', blogRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    logger.info(`Sunucu ${PORT} portunda çalışıyor...`);
});