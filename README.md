# 🚀 Kişisel YBS Portfolyo Platformu (MERN Stack)

Bu proje, **Yönetim Bilişim Sistemleri (MIS)** vizyonunu modern web teknolojileriyle birleştiren, full-stack bir kişisel markalama platformudur.

Sıradan bir portfolyo sitesinden farklı olarak; **CMS (İçerik Yönetim Sistemi)**, **Canlı Veri Analitiği**, **Proje Yönetim Paneli** ve **İnteraktif Modüller** içerir.

![Project Screenshot](https://via.placeholder.com/1200x600?text=Proje+Ekran+Goruntusu+Buraya)
*(Buraya projenin ekran görüntüsünü koyabilirsin)*

## ✨ Temel Özellikler

### 🎨 Frontend (Kullanıcı Arayüzü)
* **Modern Dashboard Tasarımı:** Bento Grid yapısı ve Glassmorphism efektleri.
* **Canlı Analitik:** GitHub aktivitesi, kod satır sayısı ve teknoloji dağılımı grafikleri (Recharts).
* **İnteraktif Modüller:**
    * 🖥️ **Web Terminal:** Ziyaretçiler komut satırı ile etkileşime geçebilir.
    * 🌍 **Global Harita:** CSS tabanlı dünya haritası görselleştirmesi.
    * 💰 **Maliyet Hesaplayıcı:** Proje bütçesi için dinamik hesaplama aracı.
* **Sinematik Animasyonlar:** Framer Motion ile sayfa geçişleri, özel imleç (cursor) ve preloader.

### ⚙️ Backend & Yönetim
* **Admin Paneli:** Proje ve Blog yazılarını eklemek/düzenlemek için özel dashboard.
* **RESTful API:** Node.js ve Express.js ile yazılmış ölçeklenebilir API yapısı.
* **Veritabanı:** MongoDB (Atlas) ile esnek veri modelleme.
* **İletişim Yönetimi:** Gelen mesajlar veritabanına kaydedilir ve panelden yönetilir.

## 🛠️ Teknolojiler (Tech Stack)

| Alan | Teknoloji |
|---|---|
| **Frontend** | React.js, Vite, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Analitik** | Recharts, React-CountUp |
| **Araçlar** | Postman, Figma, Git |

## 🚀 Kurulum

Projeyi yerel makinenizde çalıştırmak için:

1.  **Repoyu Klonlayın**
    ```bash
    git clone [https://github.com/KULLANICI_ADIN/portfolio.git](https://github.com/KULLANICI_ADIN/portfolio.git)
    cd portfolio
    ```

2.  **Bağımlılıkları Yükleyin**
    ```bash
    # Ana dizinde (Otomatik kurulum scripti varsa) veya tek tek:
    cd server && npm install
    cd ../client && npm install
    ```

3.  **Çevresel Değişkenleri (.env) Ayarlayın**
    `server` klasörü içine `.env` dosyası oluşturun:
    ```properties
    PORT=5000
    MONGO_URI=senin_mongodb_baglanti_linkin
    ```

4.  **Uygulamayı Başlatın**
    Terminal 1 (Backend):
    ```bash
    cd server
    npm run dev
    ```
    Terminal 2 (Frontend):
    ```bash
    cd client
    npm run dev
    ```

## 📂 Proje Yapısı

```text
portfolio/
├── client/          # React Frontend
│   ├── src/
│   │   ├── components/  # Modüler bileşenler (Charts, Terminal, vb.)
│   │   ├── pages/       # Ana sayfalar (Home, Blog, Admin...)
│   │   └── ...
├── server/          # Node.js Backend
│   ├── models/      # Veritabanı Şemaları
│   ├── routes/      # API Rotaları
│   └── ...