// server/seedAdmin.js — İlk admin hesabını oluşturur
// Kullanım: node seedAdmin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const AdminUser = require('./models/AdminUser');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Bağlandı...');

        // Zaten admin var mı kontrol et
        const existingAdmin = await AdminUser.findOne({ role: 'superadmin' });
        if (existingAdmin) {
            console.log('⚠️  Superadmin zaten mevcut:', existingAdmin.email);
            console.log('Yeni bir admin oluşturmak için admin panelinden "Kayıt Ol" kullanın.');
            process.exit(0);
        }

        // Kimlik bilgileri .env'den okunur (koda gömülmez)
        const email = process.env.SEED_ADMIN_EMAIL;
        const password = process.env.SEED_ADMIN_PASSWORD;
        const displayName = process.env.SEED_ADMIN_NAME || 'YBS Admin';

        if (!email || !password) {
            console.error('❌ SEED_ADMIN_EMAIL ve SEED_ADMIN_PASSWORD .env dosyasında tanımlı olmalı.');
            console.error('   Örnek: .env.example dosyasına bakın.');
            process.exit(1);
        }
        if (password.length < 8) {
            console.error('❌ SEED_ADMIN_PASSWORD en az 8 karakter olmalıdır.');
            process.exit(1);
        }

        // İlk superadmin hesabı oluştur
        const admin = await AdminUser.create({
            email,
            password,
            displayName,
            role: 'superadmin'
        });

        console.log('✅ Superadmin hesabı oluşturuldu!');
        console.log(`   Email: ${admin.email}`);
        console.log('');
        console.log('⚠️  ÖNEMLİ: Giriş yaptıktan sonra şifrenizi hemen değiştirin!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Hata:', error.message);
        process.exit(1);
    }
};

seedAdmin();
