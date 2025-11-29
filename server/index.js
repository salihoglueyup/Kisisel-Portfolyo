const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const messageRoutes = require('./routes/messageRoutes');
const blogRoutes = require('./routes/blogRoutes');
const projectRoutes = require('./routes/projectRoutes');

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/', (req, res) => {
    res.send('API Çalışıyor! YBS Portfolio Backend Hazır.');
});

app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/blogs', blogRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor...`);
});